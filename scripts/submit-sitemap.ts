import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { clientEnv } from "@/config/env/client.mjs";
import { google } from "googleapis";

const main = async () => {
  // 現在のサイトマップを取得
  const sitemap = (() => {
    try {
      return readFileSync(resolve(__dirname, "../gh-pages/sitemap.xml"), "utf-8");
    } catch {
      return "";
    }
  })();

  // 新しいサイトマップを取得
  const newSitemap = readFileSync(resolve(__dirname, "../out/sitemap.xml"), "utf-8");

  // 完全に同じ場合は何もしない
  if (sitemap === newSitemap) {
    console.log("サイトマップに変更はありません");
    return;
  }

  console.log("サイトマップに変更があります");

  const searchConsole = google.searchconsole("v1");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: JSON.parse(process.env.GOOGLE_CLOUD_PRIVATE_KEY || ""),
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });

  const authClient = await auth.getClient();
  // @ts-ignore
  google.options({ auth: authClient });

  await searchConsole.sitemaps.submit({
    siteUrl: clientEnv.NEXT_PUBLIC_SITE_URL,
    // ここでは現在のサイトマップのURLを指定するが、クロールより先にサイトマップが更新されるため問題ない
    feedpath: `${clientEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  });
};

main();
