// NOTICE: 循環参照を避けるためにとりあえず適当なモジュール名で切り出しただけ

import { labelCodeSeparator } from "./config";
import type { GHIssue } from "./types";

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
