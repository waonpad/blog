import type { listIssues } from "@/lib/issue";
import Link from "next/link";
import { Time } from "./time";

type Props = {
  articles: Awaited<ReturnType<typeof listIssues>>;
};

export const ArticleList = ({ articles }: Props) => {
  return (
    <ol className="flex flex-col gap-4">
      {articles.map((article) => (
        <li key={article.number}>
          <Time dateTime={article.created_at} />
          <Link href={`/articles/${article.number}`}>{article.title}</Link>
        </li>
      ))}
    </ol>
  );
};
