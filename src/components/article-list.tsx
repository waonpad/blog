import type { IssueListItem } from "@/lib/issue";
import Link from "next/link";
import { Time } from "./time";

type Props = {
  articles: IssueListItem[];
};

export const ArticleList = ({ articles }: Props) => {
  return (
    <ol className="flex flex-col gap-4">
      {articles.map((article) => (
        <li key={article.number}>
          <Time dateTime={article.created_at} />
          <Link href={`/articles/${article.number}`} className="block">
            {article.title}
          </Link>
        </li>
      ))}
    </ol>
  );
};
