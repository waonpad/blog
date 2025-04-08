import { labelCodeSeparator } from "./config";
import type { GHLabel, Label } from "./types";

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
 * extractDisplayLabelDescription("label___description") // "description"
 */
const extractDisplayLabelDescription = (labelDescription: string): string | null => {
  if (!labelDescription.includes(labelCodeSeparator)) {
    return labelDescription;
  }

  return labelDescription.split(labelCodeSeparator)[1] || null;
};

/**
 * プロジェクト内でラベルを扱うために加工処理をする
 */
export const transformLabel = <T extends GHLabel | Label>(label: T): Label => {
  // 既にtransformされている場合はそのまま返す
  if (("code" satisfies keyof Label) in label) return label as Label;

  // パスパラメータ等に表示するためのコードがdescriptionに埋め込まれていた場合、コードを取得
  const extractedCode = label.description ? extractLabelCode(label.description) : null;
  // コードが存在しない場合はnameをコードとして使用
  const code = extractedCode || label.name;

  // 表示用のdescriptionを取得
  const description = label.description ? extractDisplayLabelDescription(label.description) : null;

  return {
    ...label,
    description,
    code,
  };
};
