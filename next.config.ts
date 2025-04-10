import type {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_EXPORT,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants.js";
import { clientEnv } from "./src/config/env/client";
import "./src/config/env/server";
import type { NextConfig } from "next";
import { buildGithubPagesUrl, extractOwnerAndNameFromRepo } from "./src/utils/github";

const svgRegex = /\.svg$/;

export default (
  _phase:
    | typeof PHASE_EXPORT
    | typeof PHASE_DEVELOPMENT_SERVER
    | typeof PHASE_PRODUCTION_BUILD
    | typeof PHASE_PRODUCTION_SERVER,
  {
    defaultConfig,
  }: {
    defaultConfig: NextConfig;
  },
): NextConfig => {
  return {
    ...defaultConfig,
    // GitHub Pages にデプロイするためにサーバー環境無しで動作するようにする
    output: "export",
    // GitHub Pages はパスの末尾に強制的にスラッシュを追加するため、これに対応するために trailingSlash を true にする
    trailingSlash: true,
    basePath:
      clientEnv.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY &&
      new URL(buildGithubPagesUrl(extractOwnerAndNameFromRepo(clientEnv.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY)))
        .pathname,
    typescript: {
      tsconfigPath: "./tsconfig.build.json",
    },
    experimental: {
      typedRoutes: true,
    },
    images: {
      disableStaticImages: true, // importした画像の型定義設定を無効にする設定
    },
    webpack: (config) => {
      config.module.rules.push({
        test: svgRegex,
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
  };
};
