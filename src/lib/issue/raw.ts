import { readFileSync } from "node:fs";
import matter from "gray-matter";
import { type buildIssueCommentFilePath, buildIssueFilePath } from "./path";
import type { GHIssue, GHIssueComment } from "./types";

/**
 * パースのみで特別な加工無しのIssueデータを取得
 */
export const getRawIssueData = (issueNumber: number): GHIssue => {
  const filePath = buildIssueFilePath(issueNumber);

  return getRawIssueDataFromFilePath(filePath);
};

/**
 * パースのみで特別な加工無しのIssueデータをファイルパスから直接取得
 */
export const getRawIssueDataFromFilePath = (filePath: ReturnType<typeof buildIssueFilePath>): GHIssue => {
  const rawFileContent = readFileSync(filePath, { encoding: "utf-8" });
  const { data, content } = matter(rawFileContent);

  return {
    ...(data as GHIssue),
    body: content,
  };
};

/**
 * パースのみで特別な加工無しのIssueコメントデータをファイルパスから直接取得
 */
export const getRawIssueCommentDataFromFilePath = (
  filePath: ReturnType<typeof buildIssueCommentFilePath>,
): GHIssueComment => {
  const rawFileContent = readFileSync(filePath, { encoding: "utf-8" });
  const { data, content } = matter(rawFileContent);

  return {
    ...(data as GHIssueComment),
    body: content,
  };
};
