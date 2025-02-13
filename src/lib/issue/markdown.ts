import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { clientEnv } from "@/config/env/client";
import { transformerCopyButton } from "@rehype-pretty/transformers/copy-button";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeToc from "rehype-toc";
import remarkHtml from "remark-html";
import { unified } from "unified";

/**
 * MarkdownをHTMLに変換する
 *
 * [remarkjs/remark](https://github.com/remarkjs/remark)
 */
export const renderMarkdown = async (content: string): Promise<string> => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {
      repository: clientEnv.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY || "user/repo",
      buildUrl: (values) => {
        // Issueの場合のみ記事リンクとして扱う
        if (values.type === "issue") {
          // articles/[issueNumber]/ にリンクする
          // GitHub Pagesの場合は末尾にスラッシュを付けるため、リンクの末尾にもスラッシュを付ける
          // next.config.ts の trailingSlash の値に合わせる
          return `${clientEnv.NEXT_PUBLIC_SITE_URL}/articles/${values.no}/`;
        }

        // Issue以外のリンクを書く事は無いはずだが、もし書かれていてもリンクにしない
        return false;
      },
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    // YouTubeの埋め込み等をするためのやつ
    .use(rehypeRaw)
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
