import { ArticleList } from "@/components/article-list";
import { getIssues } from "@/lib/issue";
import { getLabels } from "@/lib/issue/label";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ tagCode: string }>;
};

export const generateStaticParams = async (): Promise<Awaited<Props["params"]>[]> => {
  const labels = await getLabels();

  return labels.map((label) => {
    return {
      tagCode: label.code,
    };
  });
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const labels = await getLabels();

  const label = labels.find((label) => label.code === params.tagCode);

  if (!label) throw new Error(`タグが見つかりません。タグコード: ${params.tagCode}`);

  return {
    title: label.name,
    description: `${label.name}に関連する記事の一覧です。`,
  };
};

export default async function Page(props: Props) {
  const params = await props.params;
  const labels = await getLabels();

  const label = labels.find((label) => label.code === params.tagCode);

  if (!label) throw new Error(`タグが見つかりません。タグコード: ${params.tagCode}`);

  const issues = await getIssues();

  // labelsにparams.tagCodeが含まれるissueのみを抽出
  const filteredIssues = issues.filter((issue) =>
    (issue.labels as Required<Exclude<(typeof issues)[0]["labels"][0], string>>[]).some(
      (label) => label.code === params.tagCode,
    ),
  );

  return (
    <section>
      <header className="markdown mb-4!">
        <h1>
          {label.name} <span className="text-[75%] text-slate-300">の記事一覧</span>
        </h1>
      </header>
      <ArticleList articles={filteredIssues} />
    </section>
  );
}
