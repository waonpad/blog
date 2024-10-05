import { ArticleList } from "@/components/article-list";
import { listIssues } from "@/lib/issue";

export default async function Page() {
  const issues = await listIssues();

  return (
    <section>
      <header className="markdown !mb-4">
        <h1>記事一覧</h1>
      </header>
      <ArticleList articles={issues} />
    </section>
  );
}
