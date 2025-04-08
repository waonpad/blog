import type { Linter } from "eslint";
import sonarjs from "eslint-plugin-sonarjs";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  // 無視するファイルを指定
  { ignores: [".next/**", "out/**"] },
  // 適用するファイルを指定
  { files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"] },
  // @ts-ignore
  tseslint.configs.base,
  // sonarjsのプラグインを追加
  // https://github.com/SonarSource/eslint-plugin-sonarjs
  {
    plugins: { sonarjs },
    rules: {
      // 即座にreturnする場合は変数に代入せずにreturnするようにする
      // https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/prefer-immediate-return.md
      "sonarjs/prefer-immediate-return": "error",
    } satisfies Partial<Record<`sonarjs/${keyof typeof sonarjs.rules}`, Linter.RulesRecord[string]>>,
  },
]);
