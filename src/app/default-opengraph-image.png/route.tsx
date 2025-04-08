import { readFileSync } from "node:fs";
import { join } from "node:path";
import Logo from "@/app/logo.svg";
import { clientEnv } from "@/config/env/client";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// NOTICE: 表示する内容(アプリ名)を変える場合はレイアウトの崩れに注意
export const GET = () => {
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
          fontFamily: "Roboto",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: 80 }}>
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
              marginBottom: 24,
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
          data: readFileSync(join(process.cwd(), "src/assets/fonts/Roboto/Roboto-Medium.ttf")),
          name: "Roboto",
        },
      ],
    },
  );
};
