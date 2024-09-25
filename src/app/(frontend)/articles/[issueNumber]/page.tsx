import { ExternalLink } from "@/components/external-link";
import { Time } from "@/components/time";
import { getIssue, listIssueComments, listIssues } from "@/lib/issue";
import type { Metadata } from "next";

type Props = {
  params: { issueNumber: string };
};

export const generateStaticParams = async (): Promise<Props["params"][]> => {
  const issues = await listIssues();

  return issues.map((issue) => {
    return {
      issueNumber: issue.number.toString(),
    };
  });
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const issueNumber = Number(params.issueNumber);
  const issue = await getIssue({ issueNumber });

  return {
    title: issue.title,
  };
};

export default async function Page({ params }: Props) {
  const issueNumber = Number(params.issueNumber);
  const issue = await getIssue({ issueNumber });
  const issueComments = await listIssueComments({ issueNumber });

  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-700">
      <article className="markdown">
        <header>
          <Time dateTime={issue.created_at} />
          <h1>{issue.title}</h1>
        </header>
        <aside className="block text-[.8rem] text-gray-500 dark:text-gray-400">
          <p>
            Posted by&nbsp;
            <ExternalLink href={issue.user!.html_url!}>{issue.user!.login}</ExternalLink>
            &nbsp;at&nbsp;
            <ExternalLink href={issue.html_url}>{`#${issue.number}`}</ExternalLink>.
          </p>
        </aside>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </article>
      {issueComments.map((issueComment) => (
        <article key={issueComment.id} className="markdown">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
          <div dangerouslySetInnerHTML={{ __html: issueComment.body_html_md }} />
        </article>
      ))}
    </div>
  );
}
