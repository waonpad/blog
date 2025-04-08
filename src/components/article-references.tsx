import { ArticleList } from "@/components/article-list";
import { getDraftIssues, getIssue, getReservedIssues } from "@/lib/issue/issue";
import { getIssueReferences } from "@/lib/issue/reference";
import { sortByDateKey } from "@/utils/sort";

type Props = {
  issueNumber: number;
};

export const ArticleReferences = async ({ issueNumber }: Props) => {
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
    <>
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
    </>
  );
};
