export const reservedIssueTitles = ["about", "privacy-policy"] as const satisfies string[];

/**
 * ラベルのコードとdescriptionの区切り文字
 *
 * @example
 * `name___description`
 */
export const labelCodeSeparator = "___";

export const draftIssueState = "open" as const;
