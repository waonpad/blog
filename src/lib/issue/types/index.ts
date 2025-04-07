import type { Endpoints } from "@octokit/types";

/**
 * ライブラリから取り出したそのままのIssueの型をエイリアスに保存
 */
type _GHIssue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"];

/**
 * ライブラリから取り出したそのままのIssueのラベルの型をエイリアスに保存
 */
export type _GHLabel = _GHIssue["labels"][number];

/**
 * ライブラリから取り出したそのままのIssueのラベルの型を実際のものに変換
 */
export type GHLabel = Required<Exclude<_GHLabel, string>>;

/**
 * ライブラリから取り出したIssueの型を実際のものに変換
 */
export type GHIssue = Omit<_GHIssue, "body" | "labels"> & {
  body: string;
  labels: GHLabel[];
};

/**
 * 加工済みのLabelの型
 */
export type Label = GHLabel & { code: string };

/**
 * 加工済みのIssueの型
 */
export type Issue = GHIssue & { body_html_md: string; labels: Label[] };

/**
 * 加工済みのIssueのリストの型
 *
 * 詳細なデータは`Issue`型を参照
 */
export type IssueListItem = GHIssue & { labels: Label[] };

/**
 * ライブラリから取り出したそのままのIssueのコメントの型をエイリアスに保存
 */
type _GHIssueComment = Endpoints["GET /repos/{owner}/{repo}/issues/comments"]["response"]["data"][number];

/**
 * ライブラリから取り出したIssueのコメントの型を実際のものに変換
 */
export type GHIssueComment = Omit<_GHIssueComment, "body"> & { body: string };

/**
 * 加工済みのIssueのコメントの型
 */
export type IssueComment = GHIssueComment & { body_html_md: string };

export type IssueReferences = {
  number: number;
  referencings: number[];
  referencedBy: number[];
};
