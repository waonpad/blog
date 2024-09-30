import { clientEnv } from "@/config/env/client.mjs";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="mx-auto flex w-[95%] max-w-screen-lg items-center py-3">
        <nav>
          <Link href="/" className="alternative-link hover:!opacity-100 font-bold text-lg">
            {clientEnv.NEXT_PUBLIC_APP_NAME}
          </Link>
        </nav>
        <nav className="ml-auto">
          <ul className="flex gap-6">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/tags">Tags</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="mx-auto flex w-[95%] max-w-screen-lg grow flex-col py-2">{children}</main>
      <footer className="mx-auto w-[95%] max-w-screen-lg py-4 text-sm">
        <nav>
          <ul className="flex justify-center gap-6">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/tags">Tags</Link>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}
