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

export type Issue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"];

export type IssueComment = Endpoints["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"]["response"]["data"];

const dataDirectoryPath = "./data";

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
  const body_html_md = await renderMarkdown(body);

  const issue = {
    ...issueMatter.data,
    body,
    body_html_md,
    labels: issueMatter.data.labels.map(transformLabel),
  } as Issue & { body_html_md: string; labels: ReturnType<typeof transformLabel>[] };

  return issue;
};

const reservedissueTitles = ["about", "privacy-policy"] as const;

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

        // クロースされたIssueを取得するオプションが無効の場合、クロースされたIssueは除外するためnullを返す
        if (!withClosed && issueMatter.data.closed_at) return null;

        const tilte = issueMatter.data.title as string;
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
          ...issueMatter.data,
          body,
          labels: issueMatter.data.labels.map(transformLabel),
        } as Issue & { labels: ReturnType<typeof transformLabel>[] };
      })
      .filter((issue): issue is Exclude<typeof issue, null> => issue !== null),
  ).reverse();

  return issues;
};

export const getIssueByTitle = async ({ title }: { title: (typeof reservedissueTitles)[number] | (string & {}) }) => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/*/issue.md`);

  // Issueファイルを読み込み、データを取得
  const targetIssueMatter = paths
    .map((filePath) => {
      const content = readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);

      return issueMatter.data;
    })
    .find((issue) => issue.title === title);

  if (!targetIssueMatter) throw new Error(`タイトルが ${title} のIssueは見つかりませんでした`);

  const body = targetIssueMatter.content;
  const body_html_md = await renderMarkdown(body);

  const issue = {
    ...targetIssueMatter.data,
    body,
    body_html_md,
    labels: targetIssueMatter.data.labels.map(transformLabel),
  } as Issue & { body_html_md: string; labels: ReturnType<typeof transformLabel>[] };

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
        const body = issueMatter.content;
        const body_html_md = await renderMarkdown(body);

        return {
          ...issueMatter.data,
          body,
          body_html_md,
        } as IssueComment & { body_html_md: string };
      }),
    ),
  );

  return issueComments;
};

/**
 * Issueを作成日時でソートするための関数
 */
const sortByCreatedAt = <T extends { created_at: string }>(array: T[]) => {
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
export const listLabels = async () => {
  const issues = await listIssues();

  const _labels = (
    issues.flatMap((issue) => issue.labels) as Required<Exclude<(typeof issues)[0]["labels"][0], string>>[]
  ).map(transformLabel);

  const labels = sortByName(_labels.filter((label, index, self) => self.findIndex((l) => l.id === label.id) === index));

  return labels;
};

/**
 * Labelのdescriptionに埋め込まれたコードを取得してdescriptionから削除して返す
 */
const transformLabel = (label: Required<Exclude<Issue["labels"][0], string>> & { code?: string }) => {
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
export const sortByName = <T extends { name: string }>(array: T[]) => {
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
const renderMarkdown = async (content: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {
      repository: clientEnv.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY || "user/repo",
    })
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: false,
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3_000,
        }),
      ],
    })
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeSlug)
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
    .use(rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: "alternative-link" } })
    .use(remarkHtml)
    .use(rehypeStringify)
    .use(remarkGfm)
    .process(content);

  return result.toString();
};
