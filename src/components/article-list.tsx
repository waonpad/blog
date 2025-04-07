import type { IssueListItem } from "@/lib/issue/types";
import { cn } from "@/utils/styles";
import Link from "next/link";
import type { ComponentProps } from "react";
import { Time } from "./time";

type Props = ComponentProps<"ol"> & {
  articles: IssueListItem[];
};

export const ArticleList = ({ articles, className, ...rest }: Props) => {
  return (
    <ol {...rest} className={cn("flex flex-col gap-4", className)}>
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
