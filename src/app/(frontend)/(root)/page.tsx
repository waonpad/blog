import { Time } from "@/components/time";
import { listIssues } from "@/lib/issue";
import Link from "next/link";

export default async function Page() {
  const issues = await listIssues();

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
