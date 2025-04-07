import { readFileSync } from "node:fs";
import { sortByDateKey } from "@/utils/sort";
import { glob } from "glob";
import matter from "gray-matter";
import { buildIssueFilePath, draftIssueState, issueFilePathGlobPattern, reservedIssueTitles } from "./config";
import { renderMarkdown } from "./markdown";
import { transformLabel } from "./transform";
import type { GHIssue, Issue, IssueListItem } from "./types";

/**
 * Issueを取得
 */
export const getIssue = async (issueNumber: number): Promise<Issue> => {
  // Issueファイルのパスを取得
  const filePath = buildIssueFilePath(issueNumber);

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
export const getIssues = async ({
  withDraft = false,
  withReserved,
}: {
  withDraft?: boolean;
  withReserved?: (typeof reservedIssueTitles)[number][];
} = {}): Promise<IssueListItem[]> => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(issueFilePathGlobPattern);

  // Issueファイルを読み込み、データを取得
  const issues = sortByDateKey(
    paths
      .map((filePath) => {
        const content = readFileSync(filePath, { encoding: "utf-8" });
        const issueMatter = matter(content);
        const issueData = issueMatter.data as GHIssue;

        // 下書きのIssueを取得するオプションが無効の場合、開いているIssueは除外するためnullを返す
        if (!withDraft && issueData.state === draftIssueState) return null;

        const tilte = issueData.title;
        if (
          // 予約されたIssueのタイトルであって
          reservedIssueTitles.some((title) => title === tilte) &&
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
    "created_at",
    { order: "desc" },
  );

  return issues;
};

/**
 * タイトルからIssueを取得
 */
export const getIssueByTitle = async (title: (typeof reservedIssueTitles)[number] | (string & {})): Promise<Issue> => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(issueFilePathGlobPattern);

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
