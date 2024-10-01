import type { ReactNode } from "react";
import "@/styles/globals.scss";
import "@/styles/markdown.scss";
import { clientEnv } from "@/config/env/client.mjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: clientEnv.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description: "",
  icons: `${clientEnv.NEXT_PUBLIC_BASE_PATH}/favicon.ico`,
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-dvh flex-col">{children}</body>
      {clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  );
}
