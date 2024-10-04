import { ExternalLink } from "@/components/external-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "プライバシーポリシーに関する事について記載しています。",
};

export default function Page() {
  return (
    <p className="whitespace-pre-wrap">
      {"当サイトは Google Analytics を使用しています。\n詳しくは "}
      <ExternalLink href="https://policies.google.com/technologies/partner-sites?hl=ja">
        {"Google のサービスを使用するサイトやアプリから収集した情報の Google による使用 – ポリシーと規約"}
      </ExternalLink>
      {" をご覧ください。"}
    </p>
  );
}
