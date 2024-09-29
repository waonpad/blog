import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY: z.string().min(1).optional(),
    NEXT_PUBLIC_BASE_PATH: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY: process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY
      ? `/${process.env.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY.split("/")[1]}`
      : "",
  },
});
