import { sortByKey } from "@/utils/sort";
import { getIssues } from "./issue";
import { transformLabel } from "./transform";

/**
 * Labelの一覧を取得
 */
export const getLabels = async (): Promise<ReturnType<typeof transformLabel>[]> => {
  const issues = await getIssues();

  const _labels = issues.flatMap((issue) => issue.labels).map(transformLabel);

  return sortByKey(
    _labels.filter((label, index, self) => self.findIndex((l) => l.id === label.id) === index),
    "name",
  );
};
