import type { ReactNode } from "react";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import { clientEnv } from "@/config/env/client";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: clientEnv.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description: `${clientEnv.NEXT_PUBLIC_GITHUB_USER}のブログです。`,
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  openGraph: {
    images: [
      {
        url: "/default-opengraph-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
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
