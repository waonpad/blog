// NOTICE: 循環参照を避けるためにとりあえず適当なモジュール名で切り出しただけ

import type { Optional } from "utility-types";
import { labelCodeSeparator } from "./config";
import type { Label } from "./types";

/**
 * @example
 * extractLabelCode("label___description") // "label"
 */
const extractLabelCode = (labelDescription: string): string | null => {
  if (!labelDescription.includes(labelCodeSeparator)) {
    return null;
  }

  const code = labelDescription.split(labelCodeSeparator)[0];

  return code === "" ? null : code;
};

/**
 * @example
 * extractDisplayDescription("label___description") // "description"
 */
const extractDisplayDescription = (labelDescription: string): string | null => {
  if (!labelDescription.includes(labelCodeSeparator)) {
    return labelDescription;
  }

  return labelDescription.split(labelCodeSeparator)[1] || null;
};

/**
 * プロジェクト内でラベルを扱うために加工処理をする
 */
export const transformLabel = <T extends Optional<Label, "code">>(label: T): Label => {
  // 既にtransformされている場合はそのまま返す
  if (label.code !== undefined) return label as Label;

  // パスパラメータ等に表示するためのコードがdescriptionに埋め込まれていた場合、コードを取得
  const extractedCode = label.description ? extractLabelCode(label.description) : null;
  // コードが存在しない場合はnameをコードとして使用
  const code = extractedCode || label.name;

  // 表示用のdescriptionを取得
  const description = label.description ? extractDisplayDescription(label.description) : null;

  return {
    ...label,
    description,
    code,
  };
};
