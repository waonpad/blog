import { readFileSync } from "node:fs";
import { sortByDateKey } from "@/utils/sort";
import { glob } from "glob";
import matter from "gray-matter";
import { dataDirectoryPath } from "./config";
import { renderMarkdown } from "./markdown";
import type { GHIssueComment, IssueComment } from "./types";

/**
 * Issueのコメント一覧を取得
 */
export const listIssueComments = async ({
  issueNumber,
}: {
  issueNumber: number;
}): Promise<IssueComment[]> => {
  // Issueのコメントファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/${issueNumber}/issue_comments/*.md`);

  // Issueのコメントファイルを読み込み、データを取得
  const issueComments = sortByDateKey(
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
    "created_at",
    { order: "asc" },
  );

  return issueComments;
};
