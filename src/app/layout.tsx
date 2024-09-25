import type { ReactNode } from "react";
import "@/styles/globals.scss";
import "@/styles/markdown.scss";
import { APP_NAME } from "@/config/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "",
  icons: `${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.ico`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
