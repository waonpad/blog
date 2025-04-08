import type { Endpoints } from "@octokit/types";
import type { Overwrite } from "utility-types";

/**
 * ライブラリから取り出したそのままのIssueの型をエイリアスに保存
 */
type _GHIssue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"];

/**
 * ライブラリから取り出したそのままのIssueのコメントの型をエイリアスに保存
 */
type _GHIssueComment = Endpoints["GET /repos/{owner}/{repo}/issues/comments"]["response"]["data"][number];

/**
 * ライブラリから取り出したそのままのIssueのラベルの型をエイリアスに保存
 */
type _GHLabel = _GHIssue["labels"][number];

/**
 * ライブラリから取り出したそのままのIssueのラベルの型を実際のものに変換
 */
export type GHLabel = Required<Exclude<_GHLabel, string>>;

/**
 * 加工済みのLabelの型
 */
export type Label = GHLabel & { code: string };

/**
 * ライブラリから取り出したIssueの型を実際のものに変換
 */
export type GHIssue = Overwrite<_GHIssue, { body: string; labels: GHLabel[] }>;

/**
 * 加工済みのIssueの型
 */
export type Issue = Overwrite<GHIssue, { labels: Label[] }> & { body_html_md: string };

/**
 * 加工済みのIssueのリストの型
 *
 * 詳細なデータは`Issue`型を参照
 */
export type IssueListItem = Overwrite<GHIssue, { labels: Label[] }>;

/**
 * ライブラリから取り出したIssueのコメントの型を実際のものに変換
 */
export type GHIssueComment = Overwrite<_GHIssueComment, { body: string }>;

/**
 * 加工済みのIssueのコメントの型
 */
export type IssueComment = GHIssueComment & { body_html_md: string };

/**
 * Issueの参照関係を表す型
 */
export type IssueReferences = {
  number: number;
  referencings: number[];
  referencedBy: number[];
};
