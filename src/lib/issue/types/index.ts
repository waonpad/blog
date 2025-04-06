import type { Endpoints } from "@octokit/types";

/**
 * ライブラリから取り出したそのままのIssueの型をエイリアスに保存
 */
type _GHIssue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"];

/**
 * ライブラリから取り出したIssueの型を実際のものに変換
 */
export type GHIssue = Omit<_GHIssue, "labels"> & { labels: Required<Exclude<_GHIssue["labels"][number], string>>[] };

/**
 * 加工済みのLabelの型
 */
export type Label = Required<Exclude<GHIssue["labels"][number], string>> & { code: string };

/**
 * 加工済みのIssueの型
 */
export type Issue = Omit<GHIssue, "body"> & { body: string; body_html_md: string; labels: Label[] };

/**
 * 加工済みのIssueのリストの型
 *
 * 詳細なデータは`Issue`型を参照
 */
export type IssueListItem = Omit<GHIssue, "body"> & { body: string; labels: Label[] };

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
export type IssueComment = Omit<GHIssueComment, "body"> & { body: string; body_html_md: string };

export type IssueReference = {
  number: number;
  referencings: number[];
  referencedBy: number[];
};
