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
  } as Issue & { body_html_md: string };

  return issue;
};

/**
 * Issueの一覧を取得
 */
export const listIssues = async () => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/*/issue.md`);

  // Issueファイルを読み込み、データを取得
  const issues = sortByCreatedAt(
    paths.map((filePath) => {
      const content = readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);
      const body = issueMatter.content;

      return {
        body,
        ...issueMatter.data,
      } as Issue;
    }),
  ).reverse();

  return issues;
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
