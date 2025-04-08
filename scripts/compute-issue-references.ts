import { writeFileSync } from "node:fs";
import { reservedIssueTitles } from "@/lib/issue/config";
import { getIssues } from "@/lib/issue/issue";
import { issueReferencesFilePath } from "@/lib/issue/path";
import { getReferencingIssueNumbers } from "@/lib/issue/reference";
import type { IssueReferences } from "@/lib/issue/types";

const saveIssueReferences = async () => {
  const issues = await getIssues({
    withDraft: true,
    withReserved: reservedIssueTitles,
  });

  const issueReferences: Omit<IssueReferences, "referencedBy">[] = await Promise.all(
    issues.map(async (issue) => {
      return {
        number: issue.number,
        referencings: await getReferencingIssueNumbers(issue.number),
      };
    }),
  );

  const processedIssueReferences: IssueReferences[] = issueReferences.map((issueReference, _, self) => ({
    ...issueReference,
    // 各Issue自身が参照されているIssueの番号を取得
    referencedBy: self
      .filter((issue) => issue.referencings.includes(issueReference.number))
      .map((issue) => issue.number),
  }));

  // referencings: 参照の登場順
  // referencedBy: Issue番号の若い順

  // JSONファイルに保存
  writeFileSync(issueReferencesFilePath, JSON.stringify(processedIssueReferences, null, 2), { encoding: "utf-8" });
};

const main = async () => {
  await saveIssueReferences();
};

main();
