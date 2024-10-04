import { getIssueByTitle, listIssueComments } from "@/lib/issue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  // NOTICE: サイト管理者の名前に書き換える
  description: "waonpadのブログです。このブログと私の事について記載しています。",
};

export default async function Page() {
  const issue = await getIssueByTitle({ title: "about" });

  const issueComments = await listIssueComments({ issueNumber: issue.number });

  return (
    <div className="w-full divide-y divide-[#30363db3]">
      <div className="markdown">
        <header>
          <h1 className="!mt-0">このブログについて</h1>
        </header>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </div>
      {issueComments.map((issueComment) => (
        <div key={issueComment.id} className="markdown pt-4">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
          <div dangerouslySetInnerHTML={{ __html: issueComment.body_html_md }} />
        </div>
      ))}
    </div>
  );
}
