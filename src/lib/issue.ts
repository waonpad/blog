import { readFileSync } from "node:fs";
import { glob } from "glob";
import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

// TODO: 型定義を追加する
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Issue = any;

// TODO: 型定義を追加する
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type IssueComment = any;

const dataDirectoryPath = process.env.DATA_DIRECTORY_PATH || "./data";

/**
 * Issueを取得
 */
export const getIssue = async ({ issueNumber }: { issueNumber: number }) => {
  // Issueファイルのパスを取得
  const filePath = `${dataDirectoryPath}/issues/${issueNumber}/issue.md`;

  // Issueファイルを読み込み、データを取得
  const content = readFileSync(filePath, { encoding: "utf-8" });
  const issueMatter = matter(content);
  const body = issueMatter.content;
  const bodyHTML = await renderMarkdown(body);

  return {
    body,
    bodyHTML,
    ...issueMatter.data,
  };
};

/**
 * Issueの一覧を取得
 */
export const listIssues = async () => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/*/issue.md`);

  // Issueファイルを読み込み、データを取得
  return paths
    .map((filePath) => {
      const content = readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);
      const body = issueMatter.content;
      return {
        body,
        ...issueMatter.data,
      };
    })
    .sort(byCreatedAt)
    .reverse();
};

/**
 * Issueのコメント一覧を取得
 */
export const listIssueComments = async ({
  issueNumber,
}: {
  issueNumber: number;
}) => {
  // Issueのコメントファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/${issueNumber}/issue_comments/*.md`);

  // Issueのコメントファイルを読み込み、データを取得
  const issueComments = await Promise.all(
    paths.map(async (filePath: string) => {
      const content = readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);
      const body = issueMatter.content;
      const bodyHTML = await renderMarkdown(body);

      return {
        body,
        bodyHTML,
        ...issueMatter.data,
      };
    }),
  );

  return issueComments.sort(byCreatedAt);
};

/**
 * Issueを作成日時でソートするための関数
 */
// TODO: 型定義を追加する
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const byCreatedAt = (a: any, b: any) => {
  if (a.created_at < b.created_at) return -1;

  if (a.created_at > b.created_at) return 1;

  return 0;
};

/**
 * MarkdownをHTMLに変換する
 *
 * [remarkjs/remark](https://github.com/remarkjs/remark)
 */
const renderMarkdown = async (content: string) => {
  const result = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {
      // NOTICE: ローカルでは GITHUB_REPOSITORY が設定されていないため "user/repo" になる
      repository: process.env.GITHUB_REPOSITORY || "user/repo",
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(remarkGfm)
    .process(content);

  return result.toString();
};
