import { ImageResponse } from "next/og";
import { type Props, generateStaticParams } from "../page";

export { generateStaticParams };

export const GET = async (_: never, { params: { issueNumber } }: Props) => {
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: "aqua",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span>Issue {issueNumber}</span>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
};
