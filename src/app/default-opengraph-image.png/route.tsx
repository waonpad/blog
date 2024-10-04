import { readFileSync } from "node:fs";
import { join } from "node:path";
import Logo from "@/app/logo.svg";
import { clientEnv } from "@/config/env/client.mjs";
import { ImageResponse } from "next/og";

// NOTICE: 表示する内容(アプリ名)を変える場合はレイアウトの崩れに注意
export const GET = async () => {
  // iOSやmacOSで使われているフォントの中で、OGPに使うものだけを読み込む
  const sfFont = readFileSync(join(process.cwd(), "src", "assets", "SF-Pro-Text-Semibold.otf"));

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
          fontSize: 96,
          backgroundColor: "#0d1117",
          width: "100%",
          height: "100%",
          display: "flex",
          color: "#e6edf3",
          flexDirection: "column",
          padding: 40,
          // Twitterに共有した時にOGPの上にページタイトルが被るため、そのぶんpaddingを追加
          paddingBottom: 64,
          fontFamily: "-apple-system",
          // 間が少し大きく見えたので調整
          letterSpacing: "-0.0397em",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Logo
            style={{
              width: 80,
              height: 80,
              marginRight: 40,
            }}
          />
          <span
            style={{
              // 位置調整
              marginBottom: 16,
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
      ],
    },
  );
};
