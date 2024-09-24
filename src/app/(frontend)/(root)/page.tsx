import { Time } from "@/components/time";
import { type Issue, listIssues } from "@/lib/issue";
import Link from "next/link";

export default async function Page() {
  // NOTICE: これの定義元は現状anyなので注意
  const issues: Issue[] = await listIssues();

  return (
    <section>
      <ol className="flex flex-col gap-12">
        {issues.map((issue) => (
          <li key={issue.number}>
            <Time dateTime={issue.created_at} />
            <Link href={`/articles/${issue.number}`}>{issue.title}</Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
