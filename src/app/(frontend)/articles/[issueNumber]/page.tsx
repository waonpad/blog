import { ArticleList } from "@/components/article-list";
import { Time } from "@/components/time";
import { getDraftIssues, getIssue, getIssues, getReservedIssues } from "@/lib/issue";
import { getIssueComments } from "@/lib/issue/comment";
import { getIssueReferences } from "@/lib/issue/reference";
import { sortByDateKey, sortByKey } from "@/utils/sort";
import type { Metadata } from "next";
import Link from "next/link";

export type Props = {
  params: Promise<{ issueNumber: string }>;
};

export const generateStaticParams = async (): Promise<Awaited<Props["params"]>[]> => {
  const issues = await getIssues();

  return issues.map((issue) => {
    return {
      issueNumber: issue.number.toString(),
    };
  });
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const issueNumber = Number(params.issueNumber);
  const issue = await getIssue(issueNumber);

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
  const issue = await getIssue(issueNumber);
  const issueComments = await getIssueComments(issueNumber);

  const labels = sortByKey(issue.labels.flat(), "name");

  const { referencings, referencedBy } = getIssueReferences(issueNumber);

  // 参照しているIssueを取得
  const referencingIssues = await Promise.all(
    referencings.map(async (referencingIssueNumber) => await getIssue(referencingIssueNumber)),
  );
  // 参照されているIssueを取得
  const referencedIssues = await Promise.all(
    referencedBy.map(async (referencedIssueNumber) => await getIssue(referencedIssueNumber)),
  );

  // 関連記事に表示させたくない、除外対象のIssue番号一覧を取得
  const excludedIssueNumbers = [...(await getReservedIssues()), ...(await getDraftIssues())].map(
    (issue) => issue.number,
  );

  // 除外対象のIssue番号を除外する
  const filteredReferencingIssues = referencingIssues.filter(
    (issue) => !excludedIssueNumbers.some((excludeIssueNumber) => excludeIssueNumber === issue.number),
  );
  const filteredReferencedIssues = referencedIssues.filter(
    (issue) => !excludedIssueNumbers.some((excludeIssueNumber) => excludeIssueNumber === issue.number),
  );

  // 参照しているIssue,されているIssueが存在するか
  const isReferencingIssuesExists = filteredReferencingIssues.length > 0;
  const isReferencedIssuesExists = filteredReferencedIssues.length > 0;
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
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </section>
      {issueComments.map((issueComment) => (
        <section key={issueComment.id} className="markdown pt-4">
          <header className="mb-2">
            <Time dateTime={issueComment.created_at} />
          </header>
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
                <ArticleList articles={filteredReferencingIssues} className="gap-2" />
              </section>
            )}
            {isReferencedIssuesExists && (
              <section>
                <header className="markdown mb-2!">
                  <h3>この記事を参照している記事</h3>
                </header>
                <ArticleList
                  articles={sortByDateKey(filteredReferencedIssues, "created_at", { order: "desc" })}
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
