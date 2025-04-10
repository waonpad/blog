import { sortByDateKey } from "@/utils/array/sort";
import { renderMarkdown } from "./markdown";
import { searchIssueCommentFilePaths } from "./path";
import { getRawIssueCommentDataFromFilePath } from "./raw";
import type { IssueComment } from "./types";

/**
 * Issueのコメント一覧を取得
 */
export const getIssueComments = async (issueNumber: number): Promise<IssueComment[]> => {
  // Issueのコメントファイルのパス一覧を取得
  const paths = await searchIssueCommentFilePaths(issueNumber);

  // Issueのコメントファイルを読み込み、データを取得
  const issueComments = await Promise.all(
    paths.map(async (filePath) => {
      const rawIssueCommentData = getRawIssueCommentDataFromFilePath(filePath);

      const body_html_md = await renderMarkdown(rawIssueCommentData.body);

      return {
        ...rawIssueCommentData,
        body_html_md,
      };
    }),
  );

  // ソートを実行
  return sortByDateKey(issueComments, "created_at", { order: "asc" });
};
