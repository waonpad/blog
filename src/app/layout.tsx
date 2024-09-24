import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/globals.scss";
import "@/styles/markdown.scss";
import type { Metadata } from "next";

const intr = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    // TODO: 後で変更する
    default: "My Blog",
    template: "%s | My Blog",
  },
  description: "",
  // metadataBase: ...,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${intr.className}`}>{children}</body>
    </html>
  );
}
