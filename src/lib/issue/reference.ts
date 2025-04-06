import { readFileSync } from "node:fs";
import { sortByDateKey } from "@/utils/sort";
import { glob } from "glob";
import matter from "gray-matter";
import remarkGithub from "remark-github";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { dataDirectoryPath } from "./config";
import type { GHIssueComment, IssueReference } from "./types";

/**
 * ファイルに保存されたデータを元に、Issueの参照関係を取得する
 */
export const getIssueReferences = ({
  issueNumber,
}: {
  issueNumber: number;
}): Omit<IssueReference, "number"> => {
  const referencesFilePath = `${dataDirectoryPath}/issue-references.json`;
  const referencesData: IssueReference[] = JSON.parse(readFileSync(referencesFilePath, { encoding: "utf-8" }));

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
 * remark-githubがMarkdownからIssueを探すロジックを利用して、参照しているIssue番号を取得する
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

  return referencingIssueNumbers;
};

export const getReferencingIssueNumbers = async ({ issueNumber }: { issueNumber: number }): Promise<number[]> => {
  // Issueファイルのパスを取得
  const issueFilePath = `${dataDirectoryPath}/issues/${issueNumber}/issue.md`;

  // Issueファイルを読み込み、データを取得
  const content = readFileSync(issueFilePath, { encoding: "utf-8" });
  const issueMatter = matter(content);
  const body = issueMatter.content;

  // Issueの本文から参照されているIssue番号一覧を取得
  const referencingIssueNumbersOfMain = await getReferencingIssueNumbersFromMarkdown(body);

  // Issueのコメントファイルのパス一覧を取得
  const issueCommentFilePaths = await glob(`${dataDirectoryPath}/issues/${issueNumber}/comments/*.md`);

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
