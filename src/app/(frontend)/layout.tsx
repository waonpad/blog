import Logo from "@/app/logo.svg";
import { ExternalLink } from "@/components/external-link";
import { clientEnv } from "@/config/env/client.mjs";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="mx-auto flex w-[95%] max-w-screen-lg items-center py-3">
        <nav>
          <Link href="/" className="alternative-link flex items-center font-bold text-lg">
            <Logo className="mr-2 h-6 w-6" />
            {clientEnv.NEXT_PUBLIC_APP_NAME}
          </Link>
        </nav>
        <nav className="ml-auto">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/about" className="alternative-link font-medium text-slate-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/tags" className="alternative-link font-medium text-slate-300">
                Tags
              </Link>
            </li>
            <li>
              <ExternalLink
                href={`https://github.com/${clientEnv.NEXT_PUBLIC_GITHUB_USER}`}
                className="alternative-link text-slate-300"
              >
                <FaGithub size={18} />
              </ExternalLink>
            </li>
          </ul>
        </nav>
      </header>
      <main className="mx-auto flex w-[95%] max-w-screen-lg grow flex-col py-2">{children}</main>
      <footer className="mx-auto w-[95%] max-w-screen-lg py-4">
        <nav className="flex flex-col gap-3">
          <ul className="flex items-center justify-center gap-6">
            <li>
              <ExternalLink
                href={`https://github.com/${clientEnv.NEXT_PUBLIC_GITHUB_USER}`}
                className="alternative-link text-slate-300"
              >
                <FaGithub size={18} />
              </ExternalLink>
            </li>
          </ul>
          <ul className="flex items-center justify-center gap-6">
            <li>
              <Link href="/" className="alternative-link font-medium text-slate-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="alternative-link font-medium text-slate-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/tags" className="alternative-link font-medium text-slate-300">
                Tags
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="alternative-link font-medium text-slate-300">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}
