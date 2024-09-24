import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/globals.scss";
import "@/styles/markdown.scss";
import { APP_NAME } from "@/config/constants";
import type { Metadata } from "next";
import Head from "next/head";

const intr = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    // TODO: 後で変更する
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "",
  // metadataBase: ...,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <Head>
        {/* favicon */}
        <link rel="icon" type="image/x-icon" href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.ico`} />
      </Head>
      <body className={`${intr.className}`}>{children}</body>
    </html>
  );
}
