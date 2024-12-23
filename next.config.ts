import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import { clientEnv } from "./src/config/env/client";
import "./src/config/env/server";
import type { NextConfig } from "next";

const nextConfig = (
  phase: string,
  {
    defaultConfig,
  }: {
    defaultConfig: NextConfig;
  },
): NextConfig => {
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
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false, // 圧縮無効
            },
          },
        ],
      });

      return config;
    },
    images: {
      disableStaticImages: true, // importした画像の型定義設定を無効にする設定
    },
  };
};

export default nextConfig;
