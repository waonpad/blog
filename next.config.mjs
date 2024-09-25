import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => {
  const basePath = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}` : "";

  return {
    ...defaultConfig,
    // GitHub Pages にデプロイするためにサーバー環境無しで動作するようにする
    output: "export",
    // GitHub Pages はパスの末尾に強制的にスラッシュを追加するため、これに対応するために trailingSlash を true にする
    trailingSlash: true,
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
    basePath,
    pageExtensions: ["ts", "tsx", "js", "jsx"].flatMap((extension) => {
      const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
      return isDevServer ? [`dev.${extension}`, extension] : extension;
    }),
    // 環境変数に設定する
    env: {
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
  };
};

export default nextConfig;
