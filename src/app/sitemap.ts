import { clientEnv } from "@/config/env/client.mjs";
import type { MetadataRoute } from "next";
import { generateStaticParams as generateStaticArticleParams } from "./(frontend)/articles/[issueNumber]/page";
import { generateStaticParams as generateStaticTagParams } from "./(frontend)/tags/[tagCode]/page";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = clientEnv.NEXT_PUBLIC_PAGES_PUBLISH_REPOSITORY
    ? `https://${clientEnv.NEXT_PUBLIC_GITHUB_USER}.github.io${clientEnv.NEXT_PUBLIC_BASE_PATH}`
    : "http://localhost:3000";

  const articleRoutes = (await generateStaticArticleParams()).map((params) => `/articles/${params.issueNumber}`);
  const tagRoutes = (await generateStaticTagParams()).map((params) => `/tags/${params.tagCode}`);

  const routes: (MetadataRoute.Sitemap[number] | string)[] = ["/", "/about", "/tags", ...articleRoutes, ...tagRoutes];

  return routes.map((route) => {
    if (typeof route === "string") {
      return { url: `${baseUrl}${route}` };
    }

    return {
      ...route,
      url: `${baseUrl}${route.url}`,
    };
  });
}
