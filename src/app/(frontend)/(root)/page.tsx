import { ArticleList } from "@/components/article-list";
import { listIssues } from "@/lib/issue";

export default async function Page() {
  const issues = await listIssues();

  return <ArticleList articles={issues} />;
}
