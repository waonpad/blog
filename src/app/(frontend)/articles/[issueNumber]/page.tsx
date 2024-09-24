import { Time } from "@/components/time";
import { type Issue, type IssueComment, getIssue, listIssueComments, listIssues } from "@/lib/issue";
import Head from "next/head";
import Link from "next/link";

export const generateStaticParams = async () => {
  // NOTICE: これの定義元は現状anyなので注意
  const issues: Array<Issue> = await listIssues();

  return issues.map((issue) => {
    return {
      issueNumber: issue.number.toString(),
    };
  });
};

export default async function Page({ params }: { params: { issueNumber: string } }) {
  const issueNumber = Number.parseInt(params.issueNumber, 10);
  // NOTICE: これの定義元は現状anyなので注意
  const issue: Issue = await getIssue({ issueNumber });
  // NOTICE: これの定義元は現状anyなので注意
  const issueComments: Array<IssueComment> = await listIssueComments({ issueNumber });

  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-700">
      <Head>
        <title>{issue.title}</title>
      </Head>
      <article className="markdown">
        <header>
          <Time dateTime={issue.created_at} />
          <h1>{issue.title}</h1>
        </header>
        <aside className="block text-[.8rem] text-gray-500 dark:text-gray-400">
          <p>
            Posted by&nbsp;
            <Link href={issue.user.html_url}>{issue.user.login}</Link>
            &nbsp;at&nbsp;
            <Link href={issue.html_url}>{`#${issue.number}`}</Link>.
          </p>
        </aside>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />
      </article>
      {issueComments.map((issueComment) => (
        <article key={issueComment.id} className="markdown">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
          <div dangerouslySetInnerHTML={{ __html: issueComment.bodyHTML }} />
        </article>
      ))}
    </div>
  );
}
