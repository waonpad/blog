export const dataDirPath = "./data";
export const issuesDirPath = `${dataDirPath}/issues` as const;
export const issueFileName = "issue.md" as const;
export const issueCommentsDirName = "comments" as const;
export const issueReferencesFileName = "issue-references.json" as const;
export const issueReferencesFilePath = `${dataDirPath}/${issueReferencesFileName}` as const;

export const buildIssueDirPath = (issueNumber: number) => `${issuesDirPath}/${issueNumber}` as const;
export const buildIssueFilePath = (issueNumber: number) =>
  `${buildIssueDirPath(issueNumber)}/${issueFileName}` as const;

export const buildIssueCommentsDirPath = (issueNumber: number) =>
  `${issuesDirPath}/${issueNumber}/${issueCommentsDirName}` as const;
export const buildIssueCommentFilePath = (issueNumber: number, commentId: number) =>
  `${buildIssueCommentsDirPath(issueNumber)}/${commentId}.md` as const;

export const issueFilePathGlobPattern = `${issuesDirPath}/*/${issueFileName}` as const;
export const buildIssueCommentFilePathGlobPattern = (issueNumber: number) =>
  `${issuesDirPath}/${issueNumber}/comments/*.md` as const;

export const reservedIssueTitles = ["about", "privacy-policy"] as const satisfies string[];

/**
 * ラベルのコードとdescriptionの区切り文字
 *
 * @example
 * `name___description`
 */
export const labelCodeSeparator = "___";
