import { clientEnv } from "@/config/env/client.mjs";
import type { MetadataRoute } from "next";
import { generateStaticParams as generateStaticArticleParams } from "./(frontend)/articles/[issueNumber]/page";
import { generateStaticParams as generateStaticTagParams } from "./(frontend)/tags/[tagCode]/page";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = clientEnv.NEXT_PUBLIC_SITE_URL;

  const articleRoutes = (await generateStaticArticleParams()).map((params) => `/articles/${params.issueNumber}`);
  const tagRoutes = (await generateStaticTagParams()).map((params) => `/tags/${params.tagCode}`);

  const routes: (MetadataRoute.Sitemap[number] | string)[] = ["/", "/about", "/tags", ...articleRoutes, ...tagRoutes];

  return (
    routes
      .map((route) => {
        if (typeof route === "string") {
          return { url: `${siteUrl}${route}` };
        }

        return {
          ...route,
          url: `${siteUrl}${route.url}`,
        };
      })
      // 常に一定の規則で並ぶようにソート
      .sort((a, b) => a.url.localeCompare(b.url))
  );
}
