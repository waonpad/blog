import { listLabels } from "@/lib/issue";
import Link from "next/link";

export default async function Page() {
  const labels = await listLabels();

  return (
    <section className="grow">
      <ul className="flex flex-col gap-2">
        {labels.map((label) => (
          <li key={label.id}>
            <Link href={`/tags/${label.code}`}>{label.name}</Link>
            <p>{label.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
