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
    <div className="w-full divide-y divide-[#30363db3]">
      <article className="markdown-body">
        <header>
          <Time dateTime={issue.created_at} />
          <h1>{issue.title}</h1>
        </header>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </article>
      {issueComments.map((issueComment) => (
        <article key={issueComment.id} className="markdown-body pt-4">
          <header className="pb-2">
            <Time dateTime={issueComment.created_at} />
          </header>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
          <div dangerouslySetInnerHTML={{ __html: issueComment.body_html_md }} />
        </article>
      ))}
    </div>
  );
}
