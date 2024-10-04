import { getIssueByTitle, listIssueComments } from "@/lib/issue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "プライバシーポリシーに関する事について記載しています。",
};

export default async function Page() {
  const issue = await getIssueByTitle({ title: "privacy-policy" });

  const issueComments = await listIssueComments({ issueNumber: issue.number });

  return (
    <div className="w-full divide-y divide-[#30363db3]">
      <div className="markdown-body">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: issue.body_html_md }} />
      </div>
      {issueComments.map((issueComment) => (
        <div key={issueComment.id} className="markdown-body pt-4">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
          <div dangerouslySetInnerHTML={{ __html: issueComment.body_html_md }} />
        </div>
      ))}
    </div>
  );
}
