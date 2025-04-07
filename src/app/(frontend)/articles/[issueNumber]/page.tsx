import { ArticleList } from "@/components/article-list";
import { Time } from "@/components/time";
import { getIssue, listIssues } from "@/lib/issue";
import { listIssueComments } from "@/lib/issue/comment";
import { getIssueReferences } from "@/lib/issue/reference";
import { sortByDateKey, sortByKey } from "@/utils/sort";
import type { Metadata } from "next";
import Link from "next/link";

export type Props = {
  params: Promise<{ issueNumber: string }>;
};

export const generateStaticParams = async (): Promise<Awaited<Props["params"]>[]> => {
  const issues = await listIssues();

  return issues.map((issue) => {
    return {
      issueNumber: issue.number.toString(),
    };
  });
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
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

export default async function Page(props: Props) {
  const params = await props.params;
  const issueNumber = Number(params.issueNumber);
  const issue = await getIssue({ issueNumber });
  const issueComments = await listIssueComments({ issueNumber });

  const labels = sortByKey(issue.labels.flat(), "name");

  const issueReferences = getIssueReferences({ issueNumber });

  const referencingIssues = await Promise.all(
    issueReferences.referencings.map(
      async (referencingIssueNumber) => await getIssue({ issueNumber: referencingIssueNumber }),
    ),
  );

  const referencedIssues = await Promise.all(
    issueReferences.referencedBy.map(
      async (referencedIssueNumber) => await getIssue({ issueNumber: referencedIssueNumber }),
    ),
  );

  const isReferencingIssuesExists = referencingIssues.length > 0;
  const isReferencedIssuesExists = referencedIssues.length > 0;
  const isAnyIssueReferenceExists = isReferencingIssuesExists || isReferencedIssuesExists;

  return (
    // コメントでの補足等を含めて1つの記事とする想定なため、最上位にarticle、その中はsectionにしている
    <article className="w-full divide-y divide-[#30363db3]">
      <section className="markdown">
        <header>
          <Time dateTime={issue.created_at} itemProp="datePublished" />
          <h1 className="mt-0!">{issue.title}</h1>
          {labels.length > 0 && (
            <ul className="mb-4 flex list-none! flex-wrap gap-2 pl-0!">
              {labels.map((label) => (
                <li key={label.id} className="mt-0!">
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
      {isAnyIssueReferenceExists && (
        <section className="pt-8">
          <header className="markdown mb-3!">
            <h2>関連記事</h2>
          </header>
          <div className="flex flex-col gap-6">
            {isReferencingIssuesExists && (
              <section>
                <header className="markdown mb-2!">
                  <h3>本文中で参照した記事</h3>
                </header>
                <ArticleList articles={referencingIssues} className="gap-2" />
              </section>
            )}
            {isReferencedIssuesExists && (
              <section>
                <header className="markdown mb-2!">
                  <h3>この記事を参照している記事</h3>
                </header>
                <ArticleList
                  articles={sortByDateKey(referencedIssues, "created_at", { order: "desc" })}
                  className="gap-2"
                />
              </section>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
