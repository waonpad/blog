import { clientEnv } from "@/config/env/client";
import { getIssueComments } from "@/lib/issue/comment";
import { getIssueByTitle } from "@/lib/issue/issue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `${clientEnv.NEXT_PUBLIC_GITHUB_USER}のブログです。このブログと私の事について記載しています。`,
};

export default async function Page() {
  const issue = await getIssueByTitle("about");

  const issueComments = await getIssueComments(issue.number);

  return (
    <article className="w-full divide-y divide-[#30363db3]">
      <section className="markdown">
        <header>
          <h1 className="mt-0!">このブログについて</h1>
        </header>
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </section>
      {issueComments.map((issueComment) => (
        <section key={issueComment.id} className="markdown pt-4">
          <div dangerouslySetInnerHTML={{ __html: issueComment.body_html_md }} />
        </section>
      ))}
    </article>
  );
}
