import { sortByKey } from "@/utils/sort";
import { getIssues } from ".";
import { transformLabel } from "./transform";

/**
 * Labelの一覧を取得
 */
export const listLabels = async (): Promise<ReturnType<typeof transformLabel>[]> => {
  const issues = await getIssues();

  const _labels = issues.flatMap((issue) => issue.labels).map(transformLabel);

  const labels = sortByKey(
    _labels.filter((label, index, self) => self.findIndex((l) => l.id === label.id) === index),
    "name",
  );

  return labels;
};
