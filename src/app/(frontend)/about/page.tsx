import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  // NOTICE: サイト管理者の名前に書き換える
  description: "waonpadのブログです。このブログと私の事について記載しています。",
};

export default function Page() {
  return <div>about</div>;
}
