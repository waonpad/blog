import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { buildPagesUrlFromRepo, extractOwnerAndNameFromRepo } from "../../utils/github";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY: z.string().min(1).optional(),
    NEXT_PUBLIC_GITHUB_USER: z.string().default(""),
    NEXT_PUBLIC_SITE_URL: z.string(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  },
  experimental__runtimeEnv: {
    // 型チェックのためにprocess.envからそのまま渡す
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY: process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY,
    // ランタイム内で新しく環境変数を作成
    NEXT_PUBLIC_GITHUB_USER:
      process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY &&
      extractOwnerAndNameFromRepo(process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY).owner,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY
      ? buildPagesUrlFromRepo(process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY)
      : process.env.NEXT_PUBLIC_SITE_URL,
  },
});
