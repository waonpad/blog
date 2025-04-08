import { getLabels } from "@/lib/issue/label";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "タグ一覧",
  description:
    "ブログに存在するタグの一覧です。このページから各タグページにアクセスして、関連する記事の一覧を閲覧できます。",
};

export default async function Page() {
  const labels = await getLabels();

  return (
    <section>
      <header className="markdown mb-4!">
        <h1>タグ一覧</h1>
      </header>
      <ul className="flex flex-col gap-2">
        {labels.map((label) => (
          <li key={label.id}>
            <Link href={`/tags/${label.code}`} className="block">
              {label.name}
            </Link>
            {label.description && <p className="mt-0.5 text-sm">{label.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
