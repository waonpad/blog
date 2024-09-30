import type { ReactNode } from "react";
import "@/styles/globals.scss";
import "@/styles/markdown.scss";
import { clientEnv } from "@/config/env/client.mjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: clientEnv.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description: "",
  icons: `${clientEnv.NEXT_PUBLIC_BASE_PATH}/favicon.ico`,
  metadataBase: new URL(
    clientEnv.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY
      ? `https://${clientEnv.NEXT_PUBLIC_GITHUB_USER}.github.io${clientEnv.NEXT_PUBLIC_BASE_PATH}`
      : "http://localhost:3000",
  ),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
