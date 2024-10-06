import { Time } from "@/components/time";
import { getIssue, listIssues } from "@/lib/issue";
import { listIssueComments } from "@/lib/issue/comment";
import { sortByKey } from "@/utils/sort";
import type { Metadata } from "next";
import Link from "next/link";

export type Props = {
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
    // descriptionどうする？一旦設定無しでおいておく
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

  const labels = sortByKey(issue.labels.flat(), "name");

  return (
    // コメントでの補足等を含めて1つの記事とする想定なため、最上位にarticle、その中はsectionにしている
    <article className="w-full divide-y divide-[#30363db3]">
      <section className="markdown">
        <header>
          <Time dateTime={issue.created_at} itemProp="datePublished" />
          <h1 className="!mt-0">{issue.title}</h1>
          {labels.length > 0 && (
            <ul className="!pl-0 !list-none mb-4 flex flex-wrap gap-2">
              {labels.map((label) => (
                <li key={label.id} className="!mt-0">
                  <Link href={`/tags/${label.code}`}>
                    <span className="chip">{label.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </section>
      {issueComments.map((issueComment) => (
        <section key={issueComment.id} className="markdown pt-4">
          <header className="mb-2">
            <Time dateTime={issueComment.created_at} />
          </header>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
          <div dangerouslySetInnerHTML={{ __html: issueComment.body_html_md }} />
        </section>
      ))}
    </article>
  );
}
