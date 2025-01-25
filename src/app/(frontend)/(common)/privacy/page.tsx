import { getIssueByTitle } from "@/lib/issue";
import { listIssueComments } from "@/lib/issue/comment";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "プライバシーポリシーに関する事について記載しています。",
};

export default async function Page() {
  const issue = await getIssueByTitle({ title: "privacy-policy" });

  const issueComments = await listIssueComments({ issueNumber: issue.number });

  return (
    <article className="w-full divide-y divide-[#30363db3]">
      <section className="markdown">
        <header>
          <h1 className="mt-0!">プライバシーポリシー</h1>
        </header>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </section>
      {issueComments.map((issueComment) => (
        <section key={issueComment.id} className="markdown pt-4">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
          <div dangerouslySetInnerHTML={{ __html: issueComment.body_html_md }} />
        </section>
      ))}
    </article>
  );
}
