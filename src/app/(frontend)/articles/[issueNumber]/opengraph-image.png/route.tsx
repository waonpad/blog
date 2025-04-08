import { readFileSync } from "node:fs";
import { join } from "node:path";
import Logo from "@/app/logo.svg";
import { clientEnv } from "@/config/env/client";
import { getIssue } from "@/lib/issue/issue";
import { ImageResponse } from "next/og";
import { type Props, generateStaticParams } from "../page";

export { generateStaticParams };

export const GET = async (_: never, props: Props) => {
  const params = await props.params;

  const { issueNumber } = params;

  const issue = await getIssue(Number(issueNumber));

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
          fontFamily: 'Roboto, "Noto Sans JP"',
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
          data: readFileSync(join(process.cwd(), "src/assets/fonts/Roboto/Roboto-Medium.ttf")),
          name: "Roboto",
        },
        {
          data: readFileSync(join(process.cwd(), "src/assets/fonts/Noto_Sans_JP/static/NotoSansJP-Bold.ttf")),
          name: "Noto Sans JP",
        },
      ],
    },
  );
};
