import "@testing-library/jest-dom/vitest";

import { loadEnvConfig } from "@next/env";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * @description
 * これを実行しないと環境変数が読み込まれない
 */
export const setupEnv = async (): Promise<void> => {
  loadEnvConfig(process.env.PWD || process.cwd());
};

setupEnv();

afterEach(() => {
  cleanup();
});
