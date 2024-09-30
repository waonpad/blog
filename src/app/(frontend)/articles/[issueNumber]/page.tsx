import { Time } from "@/components/time";
import { getIssue, listIssueComments, listIssues, sortByName } from "@/lib/issue";
import type { Metadata } from "next";
import Link from "next/link";

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
    openGraph: {
      images: [
        {
          url: `/articles/${params.issueNumber}/opengraph-image.png`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
  };
};

export default async function Page({ params }: Props) {
  const issueNumber = Number(params.issueNumber);
  const issue = await getIssue({ issueNumber });
  const issueComments = await listIssueComments({ issueNumber });

  const labels = sortByName(issue.labels.flat() as Required<Exclude<(typeof issue)["labels"][0], string>>[]);

  return (
    <div className="w-full divide-y divide-[#30363db3]">
      <article className="markdown-body">
        <header>
          <Time dateTime={issue.created_at} />
          <h1>{issue.title}</h1>
          {labels.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {labels.map((label) => (
                <Link key={label.id} href={`/tags/${label.code}`}>
                  <span className="chip">{label.name}</span>
                </Link>
              ))}
            </div>
          )}
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
