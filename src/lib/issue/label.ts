import { sortByKey } from "@/utils/array/sort";
import { uniqueByKey } from "@/utils/array/unique";
import { getIssues } from "./issue";
import type { Label } from "./types";

/**
 * 全てのIssueから、現在使用されているラベルの一覧を取得
 *
 * @returns ラベル一覧（ラベル名でソート済み）
 */
export const getLabels = async (): Promise<Label[]> => {
  const issues = await getIssues();

  const labels = issues.flatMap((issue) => issue.labels);

  return sortByKey(uniqueByKey(labels, "id"), "name");
};
