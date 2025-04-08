import type { GHLabel, Label } from "./types";
import { extractDisplayLabelDescription, extractLabelCode } from "./utils";

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
