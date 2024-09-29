import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import { clientEnv } from "./src/config/env/client.mjs";
import "./src/config/env/server.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => {
  const basePath = clientEnv.NEXT_PUBLIC_BASE_PATH;

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
    basePath,
    pageExtensions: ["ts", "tsx", "js", "jsx"].flatMap((extension) => {
      const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;
      return isDevServer ? [`dev.${extension}`, extension] : extension;
    }),
  };
};

export default nextConfig;
