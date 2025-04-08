import { sortByDateKey } from "@/utils/sort";
import { draftIssueState, reservedIssueTitles } from "./config";
import { renderMarkdown } from "./markdown";
import { searchIssueFilePaths } from "./path";
import { getRawIssueData, getRawIssueDataFromFilePath } from "./raw";
import { transformLabel } from "./transform";
import type { Issue, IssueListItem } from "./types";

/**
 * Issueを取得
 */
export const getIssue = async (issueNumber: number): Promise<Issue> => {
  const rawIssueData = getRawIssueData(issueNumber);

  return {
    ...rawIssueData,
    body_html_md: await renderMarkdown(rawIssueData.body),
    labels: rawIssueData.labels.map(transformLabel),
  };
};

/**
 * Issueの一覧を取得
 */
export const getIssues = async ({
  withDraft = false,
  withReserved,
}: {
  withDraft?: boolean;
  withReserved?: (typeof reservedIssueTitles)[number][];
} = {}): Promise<IssueListItem[]> => {
  // Issueファイルのパス一覧を取得
  const paths = await searchIssueFilePaths();

  // Issueファイルを読み込み、データを取得
  return sortByDateKey(
    paths
      .map((filePath) => {
        const rawIssueData = getRawIssueDataFromFilePath(filePath);

        // 下書きのIssueを取得するオプションが無効の場合、開いているIssueは除外するためnullを返す
        if (!withDraft && rawIssueData.state === draftIssueState) {
          return null;
        }

        if (
          // 予約されたIssueのタイトルであって
          reservedIssueTitles.some((title) => title === rawIssueData.title) &&
          // withReservedに指定されていない場合は除外する
          !(withReserved ?? []).some((title) => title === rawIssueData.title)
        ) {
          // 予約されたIssueで且つ取得する対象でないものはここで除外される
          return null;
        }

        return {
          ...rawIssueData,
          labels: rawIssueData.labels.map(transformLabel),
        };
      })
      .filter((issue): issue is Exclude<typeof issue, null> => issue !== null),
    "created_at",
    { order: "desc" },
  );
};

/**
 * タイトルからIssueを取得
 */
export const getIssueByTitle = async (title: (typeof reservedIssueTitles)[number] | (string & {})): Promise<Issue> => {
  // Issueファイルのパス一覧を取得
  const paths = await searchIssueFilePaths();

  // Issueファイルを読み込み、データを取得
  const rawIssueData = paths.map(getRawIssueDataFromFilePath).find((rawIssueData) => rawIssueData.title === title);

  if (!rawIssueData) {
    throw new Error(`タイトルが ${title} のIssueは見つかりませんでした`);
  }

  return {
    ...rawIssueData,
    body_html_md: await renderMarkdown(rawIssueData.body),
    labels: rawIssueData.labels.map(transformLabel),
  };
};

/**
 * 予約されたIssueの番号一覧を取得
 */
export const getReservedIssues = async (): Promise<Issue[]> => {
  return await Promise.all(reservedIssueTitles.map(async (title) => await getIssueByTitle(title)));
};

/**
 * 下書きのIssue一覧を取得
 */
export const getDraftIssues = async (): Promise<IssueListItem[]> => {
  const issues = await getIssues({ withDraft: true });

  return issues.filter((issue) => issue.state === draftIssueState);
};
