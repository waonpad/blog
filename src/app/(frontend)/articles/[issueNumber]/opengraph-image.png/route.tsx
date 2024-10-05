import { readFileSync } from "node:fs";
import { join } from "node:path";
import Logo from "@/app/logo.svg";
import { clientEnv } from "@/config/env/client.mjs";
import { getIssue } from "@/lib/issue";
import { getUniqueChars } from "@/utils/string";
import { ImageResponse } from "next/og";
import { type Props, generateStaticParams } from "../page";

export { generateStaticParams };

export const GET = async (_: never, { params: { issueNumber } }: Props) => {
  const issue = await getIssue({ issueNumber: Number(issueNumber) });

  // iOSやmacOSで使われているフォントの中で、OGPに使うものだけを読み込む
  const sfFont = readFileSync(join(process.cwd(), "src", "assets", "SF-Pro-Text-Semibold.otf"));

  // 既にSF-Proに含まれている文字は不要なので除外 (他にもいろいろあるが面倒なので最低限)
  const fontTargetChars = issue.title.replace(/[A-Za-z0-9]/g, "");

  const fontData = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(getUniqueChars(fontTargetChars))}`,
    )
  ).text();
  const fontUrl = fontData.match(/url\((.*?)\)/)?.[1];

  if (!fontUrl) {
    throw new Error("フォントのURLが取得できませんでした");
  }

  // Noto Sans JPのフォントを取得
  const notoFont = await (await fetch(fontUrl)).arrayBuffer();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#e6edf3",
        padding: 32,
      }}
    >
      <div
        style={{
          fontSize: 60,
          backgroundColor: "#0d1117",
          width: "100%",
          height: "100%",
          display: "flex",
          color: "#e6edf3",
          flexDirection: "column",
          padding: 40,
          // Twitterに共有した時にOGPの上にページタイトルが被るため、そのぶんpaddingを追加
          paddingBottom: 64,
          fontFamily: '-apple-system, "Noto Sans JP"',
          // 間が少し大きく見えたので調整
          letterSpacing: "-0.0397em",
          borderRadius: 20,
        }}
      >
        <span
          style={{
            textOverflow: "ellipsis",
            lineClamp: '4 "…  "',
            display: "block",
            flexGrow: 1,
          }}
        >
          {issue.title}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 72,
          }}
        >
          <Logo
            style={{
              width: 72,
              height: 72,
              marginRight: 28,
            }}
          />
          <span
            style={{
              // 位置調整
              marginBottom: 8,
            }}
          >
            {clientEnv.NEXT_PUBLIC_APP_NAME}
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: sfFont,
          name: "-apple-system",
        },
        {
          data: notoFont,
          name: "Noto Sans JP",
        },
      ],
    },
  );
};
