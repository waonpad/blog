import { readFileSync } from "node:fs";
import { sortByDateKey } from "@/utils/sort";
import { glob } from "glob";
import matter from "gray-matter";
import remarkGithub from "remark-github";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { dataDirPath, issueCommentFilePathGlobPattern, issueFilePath } from "./config";
import type { GHIssueComment, IssueReferences } from "./types";

const referencesFilePath = `${dataDirPath}/issue-references.json`;

/**
 * ファイルに保存されたデータを元に、Issueの参照関係を取得する
 *
 * @return {Object} result
 * @return {number[]} result.referencings - 参照しているIssue番号の配列(参照の登場順)
 * @return {number[]} result.referencedBy - 参照されているIssue番号の配列(Issue番号の若い順)
 */
export const getIssueReferences = ({
  issueNumber,
}: {
  issueNumber: number;
}): Omit<IssueReferences, "number"> => {
  const referencesData: IssueReferences[] = JSON.parse(readFileSync(referencesFilePath, { encoding: "utf-8" }));

  const issueReferences = referencesData.find((ref) => ref.number === issueNumber);

  if (!issueReferences) {
    throw new Error(`番号が ${issueNumber} のIssueは見つかりませんでした`);
  }

  return {
    referencings: issueReferences.referencings,
    referencedBy: issueReferences.referencedBy,
  };
};

/**
 * remark-githubがMarkdownからIssueを探すロジックを利用して、Markdownが参照しているIssue番号を取得する
 *
 * 重複は排除され、登場順で並んだ配列が返される
 *
 * @see [remarkjs/remark-github](https://github.com/remarkjs/remark-github)
 */
export const getReferencingIssueNumbersFromMarkdown = async (content: string): Promise<number[]> => {
  const referencingIssueNumbers: number[] = [];

  await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .use(remarkGithub, {
      repository: "user/repo",
      buildUrl: (values) => {
        // リンクしているIssueの番号を取得して配列に追加
        if (values.type === "issue") {
          referencingIssueNumbers.push(Number(values.no));
        }

        // Issue番号が欲しいだけなので何もしない
        return false;
      },
    })
    .process(content);

  // 重複を排除
  return Array.from(new Set(referencingIssueNumbers));
};

/**
 * Issueの本文とコメントのMarkdownから参照しているIssue番号を取得する
 *
 * 重複は排除され、登場順で並んだ配列が返される
 */
export const getReferencingIssueNumbers = async ({ issueNumber }: { issueNumber: number }): Promise<number[]> => {
  // Issueファイルのパスを取得
  const _issueFilePath = issueFilePath({ issueNumber });

  // Issueファイルを読み込み、データを取得
  const content = readFileSync(_issueFilePath, { encoding: "utf-8" });
  const issueMatter = matter(content);
  const body = issueMatter.content;

  // Issueの本文から参照されているIssue番号一覧を取得
  const referencingIssueNumbersOfMain = await getReferencingIssueNumbersFromMarkdown(body);

  // Issueのコメントファイルのパス一覧を取得
  const issueCommentFilePaths = await glob(issueCommentFilePathGlobPattern({ issueNumber }));

  // Issueのコメントファイルを読み込み、データを取得
  const issueComments = issueCommentFilePaths.map((filePath: string) => {
    const content = readFileSync(filePath, { encoding: "utf-8" });
    const issueMatter = matter(content);
    const issueData = issueMatter.data as GHIssueComment;
    const body = issueMatter.content;

    return {
      ...issueData,
      body,
    };
  });

  const sortedIssueComments = sortByDateKey(issueComments, "created_at", { order: "asc" });

  // Issueのコメントから参照されているIssue番号一覧を取得
  const referencingIssueNumbersOfComments = await Promise.all(
    sortedIssueComments.map(async ({ body }) => await getReferencingIssueNumbersFromMarkdown(body)),
  );

  // Issue全体から参照されているIssue番号一覧の配列を作成
  const uniqueReferencingIssueNumbers = Array.from(
    new Set(
      [...referencingIssueNumbersOfMain, ...referencingIssueNumbersOfComments.flat()]
        // 自分自身のIssue番号は除外
        .filter((number) => number !== issueNumber),
    ),
  );

  return uniqueReferencingIssueNumbers;
};
