export const dataDirPath = "./data";
export const issuesDirPath = `${dataDirPath}/issues` as const;
export const issueFileName = "issue.md" as const;
export const issueCommentsDirName = "comments" as const;
export const issueReferencesFileName = "issue-references.json" as const;
export const issueReferencesFilePath = `${dataDirPath}/${issueReferencesFileName}` as const;

export const issueDirPath = ({ issueNumber }: { issueNumber: number }) => `${issuesDirPath}/${issueNumber}` as const;
export const issueFilePath = ({ issueNumber }: { issueNumber: number }) =>
  `${issueDirPath({ issueNumber })}/${issueFileName}` as const;

export const issueCommentsDirPath = ({ issueNumber }: { issueNumber: number }) =>
  `${issuesDirPath}/${issueNumber}/${issueCommentsDirName}` as const;
export const issueCommentFilePath = ({ issueNumber, commentId }: { issueNumber: number; commentId: number }) =>
  `${issueCommentsDirPath({ issueNumber })}/${commentId}.md` as const;

export const issueFilePathGlobPattern = `${issuesDirPath}/*/${issueFileName}` as const;
export const issueCommentFilePathGlobPattern = ({
  issueNumber,
}: {
  issueNumber: number;
}) => `${issuesDirPath}/${issueNumber}/comments/*.md` as const;

export const reservedIssueTitles = ["about", "privacy-policy"] as const satisfies string[];

/**
 * ラベルのコードとdescriptionの区切り文字
 *
 * @example
 * `name___description`
 */
export const labelCodeSeparator = "___";
