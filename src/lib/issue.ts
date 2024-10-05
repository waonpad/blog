import { readFileSync } from "node:fs";
import { glob } from "glob";
import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { clientEnv } from "@/config/env/client.mjs";
import type { Endpoints } from "@octokit/types";
import { transformerCopyButton } from "@rehype-pretty/transformers/copy-button";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeToc from "rehype-toc";
import remarkHtml from "remark-html";
import { unified } from "unified";

/**
 * ライブラリから取り出したそのままのIssueの型をエイリアスに保存
 */
type _GHIssue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"];

/**
 * ライブラリから取り出したIssueの型を実際のものに変換
 */
export type GHIssue = Omit<_GHIssue, "labels"> & { labels: Required<Exclude<_GHIssue["labels"][number], string>>[] };

/**
 * 加工済みのIssueの型
 */
export type Issue = Awaited<ReturnType<typeof getIssue>>;

/**
 * 加工済みのIssueのリストの型
 *
 * 詳細なデータは`Issue`型を参照
 */
export type IssueListItem = Awaited<ReturnType<typeof listIssues>>[number];

/**
 * ライブラリから取り出したそのままのIssueのコメントの型をエイリアスに保存
 */
type _GHIssueComment = Endpoints["GET /repos/{owner}/{repo}/issues/comments"]["response"]["data"][number];

/**
 * ライブラリから取り出したIssueのコメントの型を実際のものに変換
 */
export type GHIssueComment = _GHIssueComment;

/**
 * 加工済みのIssueのコメントの型
 */
export type IssueComment = Awaited<ReturnType<typeof listIssueComments>>[number];

const dataDirectoryPath = "./data";

const reservedissueTitles = ["about", "privacy-policy"] as const;

/**
 * Issueを取得
 */
export const getIssue = async ({ issueNumber }: { issueNumber: number }) => {
  // Issueファイルのパスを取得
  const filePath = `${dataDirectoryPath}/issues/${issueNumber}/issue.md`;

  // Issueファイルを読み込み、データを取得
  const content = readFileSync(filePath, { encoding: "utf-8" });
  const issueMatter = matter(content);
  const issueData = issueMatter.data as GHIssue;
  const body = issueMatter.content;
  const body_html_md = await renderMarkdown(body);

  const issue = {
    ...issueData,
    body,
    body_html_md,
    labels: issueData.labels.map(transformLabel),
  };

  return issue;
};

/**
 * Issueの一覧を取得
 */
export const listIssues = async ({
  withClosed = false,
  withReserved,
}: {
  withClosed?: boolean;
  withReserved?: (typeof reservedissueTitles)[number][];
} = {}) => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/*/issue.md`);

  // Issueファイルを読み込み、データを取得
  const issues = sortByCreatedAt(
    paths
      .map((filePath) => {
        const content = readFileSync(filePath, { encoding: "utf-8" });
        const issueMatter = matter(content);
        const issueData = issueMatter.data as GHIssue;

        // クロースされたIssueを取得するオプションが無効の場合、クロースされたIssueは除外するためnullを返す
        if (!withClosed && issueData.closed_at) return null;

        const tilte = issueData.title;
        if (
          // 予約されたIssueのタイトルであって
          reservedissueTitles.some((title) => title === tilte) &&
          // withReservedに指定されていない場合は除外する
          !(withReserved ?? []).some((title) => title === tilte)
        )
          // 予約されたIssueで且つ取得する対象でないものはここで除外される
          return null;

        const body = issueMatter.content;

        return {
          ...issueData,
          body,
          labels: issueData.labels.map(transformLabel),
        };
      })
      .filter((issue): issue is Exclude<typeof issue, null> => issue !== null),
  ).reverse();

  return issues;
};

export const getIssueByTitle = async ({
  title,
}: { title: (typeof reservedissueTitles)[number] | (string & {}) }): Promise<Issue> => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/*/issue.md`);

  // Issueファイルを読み込み、データを取得
  const targetIssueMatter = paths
    .map((filePath) => {
      const content = readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);

      return issueMatter as Omit<typeof issueMatter, "data"> & { data: GHIssue };
    })
    .find((issueMatter) => issueMatter.data.title === title);

  if (!targetIssueMatter) throw new Error(`タイトルが ${title} のIssueは見つかりませんでした`);

  const issueData = targetIssueMatter.data;
  const body = targetIssueMatter.content;
  const body_html_md = await renderMarkdown(body);

  const issue = {
    ...issueData,
    body,
    body_html_md,
    labels: issueData.labels.map(transformLabel),
  };

  return issue;
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
  const issueComments = sortByCreatedAt(
    await Promise.all(
      paths.map(async (filePath: string) => {
        const content = readFileSync(filePath, { encoding: "utf-8" });
        const issueMatter = matter(content);
        const issueData = issueMatter.data as GHIssueComment;
        const body = issueMatter.content;
        const body_html_md = await renderMarkdown(body);

        return {
          ...issueData,
          body,
          body_html_md,
        };
      }),
    ),
  );

  return issueComments;
};

/**
 * Issueを作成日時でソートするための関数
 */
const sortByCreatedAt = <T extends { created_at: string }>(array: T[]): T[] => {
  return array.sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();

    if (aTime < bTime) return -1;

    if (aTime > bTime) return 1;

    return 0;
  });
};

/**
 * Labelの一覧を取得
 */
export const listLabels = async (): Promise<ReturnType<typeof transformLabel>[]> => {
  const issues = await listIssues();

  const _labels = issues.flatMap((issue) => issue.labels).map(transformLabel);

  const labels = sortByName(_labels.filter((label, index, self) => self.findIndex((l) => l.id === label.id) === index));

  return labels;
};

/**
 * Labelのdescriptionに埋め込まれたコードを取得してdescriptionから削除して返す
 */
const transformLabel = <T extends Required<Exclude<GHIssue["labels"][0], string>> & { code?: string }>(
  label: T,
): T & { code: string } => {
  // 既にtransformされている場合はそのまま返す
  if (label.code !== undefined) return label as typeof label & { code: string };

  // パスパラメータ等に表示するためのコードがdescriptionに埋め込まれていた場合、コードを取得
  const code = label.description
    ? (() => {
        if (!label.description.includes("___")) return null;

        const _code = label.description.split("___")[0];

        return _code === "" ? null : _code;
      })()
    : null;

  // コードが存在する場合はdescriptionからコードを削除
  const description = code ? (label.description ? label.description.split("___")[1] : null) : label.description;

  return {
    ...label,
    description,
    // コードが存在しない場合はnameをコードとして使用
    code: code || label.name,
  };
};

/**
 * Labelを名前でソートするための関数
 */
export const sortByName = <T extends { name: string }>(array: T[]): T[] => {
  return array.sort((a, b) => {
    if (a.name < b.name) return -1;

    if (a.name > b.name) return 1;

    return 0;
  });
};

/**
 * MarkdownをHTMLに変換する
 *
 * [remarkjs/remark](https://github.com/remarkjs/remark)
 */
const renderMarkdown = async (content: string): Promise<string> => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {
      repository: clientEnv.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY || "user/repo",
    })
    .use(remarkRehype)
    // コードブロックのシンタックスハイライト
    .use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: false,
      transformers: [
        // コードブロックのコピー機能
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3_000,
        }),
      ],
    })
    // 外部リンクを新しいタブで開く
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeSlug)
    // 目次を生成
    .use(rehypeToc, {
      customizeTOC: (toc) => {
        // @ts-ignore
        const items = (toc.children?.[0].children || []) as Node[];
        // 見出しの数が0の場合は目次を表示しない
        if (items.length === 0) return false;

        // 開いたり閉じたりできるようにする
        const wrappedToc = {
          type: "element",
          tagName: "details",
          children: [
            {
              type: "element",
              tagName: "summary",
              children: [{ type: "text", value: "目次" }],
            },
            toc,
          ],
        };

        return wrappedToc;
      },
    })
    // 見出しにリンクを追加
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: {
        className: "alternative-link",
        // tailwindによるスタイルの敵用がされない可能性があるため、直接styleを指定
        style: "display: inline-block; width: 100%;",
      },
    })
    .use(remarkHtml)
    .use(rehypeStringify)
    .use(remarkGfm)
    .process(content);

  return result.toString();
};
