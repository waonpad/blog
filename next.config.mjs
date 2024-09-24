import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },
  experimental: {
    typedRoutes: true,
  },
  // NOTICE: ローカルでは GITHUB_REPOSITORY が設定されていないため 空文字 になる
  /**
   * [変数に情報を保存する - GitHub ドキュメント](https://docs.github.com/ja/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables)
   */
  basePath: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}` : "",
  pageExtensions: ["ts", "tsx", "js", "jsx"].flatMap((extension) => {
    const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
    return isDevServer ? [`dev.${extension}`, extension] : extension;
  }),
});

export default nextConfig;
