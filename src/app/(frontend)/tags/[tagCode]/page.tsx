import { ArticleList } from "@/components/article-list";
import { listIssues, listLabels } from "@/lib/issue";
import type { Metadata } from "next";

type Props = {
  params: { tagCode: string };
};

export const generateStaticParams = async (): Promise<Props["params"][]> => {
  const labels = await listLabels();

  return labels.map((label) => {
    return {
      tagCode: label.code,
    };
  });
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const labels = await listLabels();

  const label = labels.find((label) => label.code === params.tagCode)!;

  return {
    title: label.name,
    description: `${label.name}に関連する記事の一覧です。`,
  };
};

export default async function Page({ params }: Props) {
  const issues = await listIssues();

  // labelsにparams.tagCodeが含まれるissueのみを抽出
  const filteredIssues = issues.filter((issue) =>
    (issue.labels as Required<Exclude<(typeof issues)[0]["labels"][0], string>>[]).some(
      (label) => label.code === params.tagCode,
    ),
  );

  return <ArticleList articles={filteredIssues} />;
}
