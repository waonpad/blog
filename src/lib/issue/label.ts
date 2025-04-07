import { sortByKey } from "@/utils/sort";
import { listIssues } from ".";
import { labelCodeSeparator } from "./config";
import type { GHIssue } from "./types";

/**
 * Labelの一覧を取得
 */
export const listLabels = async (): Promise<ReturnType<typeof transformLabel>[]> => {
  const issues = await listIssues();

  const _labels = issues.flatMap((issue) => issue.labels).map(transformLabel);

  const labels = sortByKey(
    _labels.filter((label, index, self) => self.findIndex((l) => l.id === label.id) === index),
    "name",
  );

  return labels;
};

/**
 * Labelのdescriptionに埋め込まれたコードを取得してdescriptionから削除して返す
 */
export const transformLabel = <T extends Required<Exclude<GHIssue["labels"][number], string>> & { code?: string }>(
  label: T,
): T & { code: string } => {
  // 既にtransformされている場合はそのまま返す
  if (label.code !== undefined) return label as T & { code: string };

  // パスパラメータ等に表示するためのコードがdescriptionに埋め込まれていた場合、コードを取得
  const code = label.description
    ? (() => {
        if (!label.description.includes(labelCodeSeparator)) return null;

        const _code = label.description.split(labelCodeSeparator)[0];

        return _code === "" ? null : _code;
      })()
    : null;

  // コードが存在する場合はdescriptionからコードを削除
  const description = code
    ? label.description
      ? label.description.split(labelCodeSeparator)[1]
      : null
    : label.description;

  return {
    ...label,
    description,
    // コードが存在しない場合はnameをコードとして使用
    code: code || label.name,
  };
};
