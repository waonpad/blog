/**
 * ローカルで実行する場合
 *
 * - 用意したアクセストークンをGITHUB_TOKENに設定
 * - リポジトリをGITHUB_REPOSITORYに設定 (例: "user/repo")
 */

import { existsSync, mkdirSync, rmdirSync, writeFileSync } from "node:fs";
import { stringify } from "gray-matter";
import { Octokit } from "octokit";

const DATA_DIR = "./data";
const ISSUES_DIR = `${DATA_DIR}/issues`;
const ISSUE_FILE = "issue.md";
const ISSUE_COMMENTS_DIR = "comments";

const issueDirPath = ({ issueNumber }: { issueNumber: number }) => `${ISSUES_DIR}/${issueNumber}` as const;

const issueFilePath = ({ issueNumber }: { issueNumber: number }) =>
  `${issueDirPath({ issueNumber })}/${ISSUE_FILE}` as const;

const issueCommentsDirPath = ({ issueNumber }: { issueNumber: number }) =>
  `${ISSUES_DIR}/${issueNumber}/${ISSUE_COMMENTS_DIR}` as const;

const issueCommentFilePath = ({ issueNumber, commentId }: { issueNumber: number; commentId: number }) =>
  `${issueCommentsDirPath({ issueNumber })}/${commentId}.md` as const;

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

      mkdirSync(issueDirPath({ issueNumber: issue.number }), { recursive: true });

      // yaml形式にする
      const yamlContent = stringify(
        // biome-ignore lint/style/noNonNullAssertion: bodyは必ず存在する
        body!,
        issueData,
      );

      // ファイルを書き込む
      writeFileSync(issueFilePath({ issueNumber: issue.number }), yamlContent);
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
      // html_url: 'https://github.com/user/repo/pull/1#issuecomment-123456'
      // /でsplitして最後から2番目が"pull"の場合はPRのコメント
      if (comment.html_url.split("/").slice(-2)[0] === "pull") continue;

      console.log("Comment #%d", comment.id);

      const { body, ...commentData } = comment;

      const issueNumber = Number(comment.issue_url.split("/").pop());

      mkdirSync(issueCommentsDirPath({ issueNumber }), { recursive: true });

      // yaml形式にする
      const yamlContent = stringify(
        // biome-ignore lint/style/noNonNullAssertion: bodyは必ず存在する
        body!,
        commentData,
      );

      // ファイルを書き込む
      writeFileSync(issueCommentFilePath({ issueNumber, commentId: comment.id }), yamlContent);
    }
  }
};

const main = async () => {
  // 削除されたものが残らないように、前のデータを削除
  if (existsSync(ISSUES_DIR)) rmdirSync(ISSUES_DIR, { recursive: true });

  await saveIssues();

  await saveIssueComments();
};

main();
