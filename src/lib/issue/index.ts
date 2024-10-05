import { readFileSync } from "node:fs";
import { sortByDateKey } from "@/utils/sort";
import { glob } from "glob";
import matter from "gray-matter";
import { dataDirectoryPath, reservedIssueTitles } from "./config";
import { transformLabel } from "./label";
import { renderMarkdown } from "./markdown";
import type { GHIssue, Issue, IssueListItem } from "./types";

/**
 * Issueを取得
 */
export const getIssue = async ({ issueNumber }: { issueNumber: number }): Promise<Issue> => {
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
  withReserved?: (typeof reservedIssueTitles)[number][];
} = {}): Promise<IssueListItem[]> => {
  // Issueファイルのパス一覧を取得
  const paths = await glob(`${dataDirectoryPath}/issues/*/issue.md`);

  // Issueファイルを読み込み、データを取得
  const issues = sortByDateKey(
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
    "closed_at",
    { order: "desc" },
  );

  return issues;
};

/**
 * タイトルからIssueを取得
 */
export const getIssueByTitle = async ({
  title,
}: { title: (typeof reservedIssueTitles)[number] | (string & {}) }): Promise<Issue> => {
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
