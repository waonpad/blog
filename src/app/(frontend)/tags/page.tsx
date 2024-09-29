import { listLabels } from "@/lib/issue";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "タグ一覧",
};

export default async function Page() {
  const labels = await listLabels();

  return (
    <section className="grow">
      <ul className="flex flex-col gap-2">
        {labels.map((label) => (
          <li key={label.id}>
            <Link href={`/tags/${label.code}`}>{label.name}</Link>
            <p className="text-sm">{label.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
