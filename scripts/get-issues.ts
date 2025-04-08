/**
 * ローカルで実行する場合
 *
 * - 用意したアクセストークンをGITHUB_TOKENに設定
 * - リポジトリをGITHUB_REPOSITORYに設定 (例: "owner/repo")
 */

import { existsSync, mkdirSync, rmdirSync, writeFileSync } from "node:fs";
import {
  buildIssueCommentFilePath,
  buildIssueCommentsDirPath,
  buildIssueDirPath,
  buildIssueFilePath,
  issuesDirPath,
} from "@/lib/issue/path";
import { Octokit } from "@octokit/rest";
import { stringify } from "gray-matter";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const saveIssues = async () => {
  const issuesIterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
    owner: (process.env.GITHUB_REPOSITORY ?? "").split("/")[0],
    repo: (process.env.GITHUB_REPOSITORY ?? "").split("/")[1],
    // 全てのissueを取得
    state: "all",
    per_page: 100,
  });

  for await (const { data: issues } of issuesIterator) {
    for (const issue of issues) {
      // PRはスキップ
      if (issue.pull_request) continue;

      console.log("Issue #%d: %s", issue.number, issue.title);

      const { body, ...issueData } = issue;

      mkdirSync(buildIssueDirPath(issue.number), { recursive: true });

      // yaml形式にする
      const yamlContent = stringify(
        // biome-ignore lint/style/noNonNullAssertion: bodyは必ず存在する
        body!,
        issueData,
      );

      // ファイルを書き込む
      writeFileSync(buildIssueFilePath(issue.number), yamlContent);
    }
  }
};

const saveIssueComments = async () => {
  const issueCommentsIterator = octokit.paginate.iterator(octokit.rest.issues.listCommentsForRepo, {
    owner: (process.env.GITHUB_REPOSITORY ?? "").split("/")[0],
    repo: (process.env.GITHUB_REPOSITORY ?? "").split("/")[1],
    per_page: 100,
  });

  for await (const { data: comments } of issueCommentsIterator) {
    for (const comment of comments) {
      // PRのコメントはスキップ
      // html_url: 'https://github.com/owner/repo/pull/1#issuecomment-123456'
      // /でsplitして最後から2番目が"pull"の場合はPRのコメント
      if (comment.html_url.split("/").slice(-2)[0] === "pull") continue;

      console.log("Comment #%d", comment.id);

      const { body, ...commentData } = comment;

      const issueNumber = Number(comment.issue_url.split("/").pop());

      mkdirSync(buildIssueCommentsDirPath(issueNumber), { recursive: true });

      // yaml形式にする
      const yamlContent = stringify(
        // biome-ignore lint/style/noNonNullAssertion: bodyは必ず存在する
        body!,
        commentData,
      );

      // ファイルを書き込む
      writeFileSync(buildIssueCommentFilePath(issueNumber, comment.id), yamlContent);
    }
  }
};

const main = async () => {
  // 削除されたものが残らないように、前のデータを削除
  if (existsSync(issuesDirPath)) rmdirSync(issuesDirPath, { recursive: true });

  await saveIssues();

  await saveIssueComments();
};

main();
