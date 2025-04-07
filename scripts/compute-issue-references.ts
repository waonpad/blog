import { writeFileSync } from "node:fs";
import { listIssues } from "@/lib/issue";
import { getReferencingIssueNumbers } from "@/lib/issue/reference";
import type { IssueReferences } from "@/lib/issue/types";

const DATA_DIR = "./data";
const REFERENCES_FILE = "issue-references.json";

const referencesFilePath = `${DATA_DIR}/${REFERENCES_FILE}` as const;

const saveIssueReferences = async () => {
  const issues = await listIssues();
  const issueReferences: Omit<IssueReferences, "referencedBy">[] = await Promise.all(
    issues.map(async (issue) => {
      const referencingIssueNumbers = await getReferencingIssueNumbers({ issueNumber: issue.number });
      return {
        number: issue.number,
        referencings: referencingIssueNumbers,
      };
    }),
  );

  const processedIssueReferences: IssueReferences[] = issueReferences.map((issueReference) => ({
    ...issueReference,
    // 各Issue自身が参照されているIssueの番号を取得
    referencedBy: issueReferences
      .filter((issue) => issue.referencings.includes(issueReference.number))
      .map((issue) => issue.number),
  }));

  // referencings: 参照の登場順
  // referencedBy: Issue番号の若い順

  // JSONファイルに保存
  writeFileSync(referencesFilePath, JSON.stringify(processedIssueReferences, null, 2), { encoding: "utf-8" });
};

const main = async () => {
  // TODO: ファイルに保存された情報を元に関連記事を表示する
  // TODO: 予約されたIssueは関連記事に表示しない？
  await saveIssueReferences();
};

main();
