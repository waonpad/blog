import { clientEnv } from "@/config/env/client.mjs";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="mx-auto max-w-2xl px-8 py-12">
        <nav>
          <p>
            <Link href="/" className="font-bold">
              {clientEnv.NEXT_PUBLIC_APP_NAME}
            </Link>
          </p>
        </nav>
      </header>
      <main className="mx-auto flex w-[95%] max-w-screen-lg grow flex-col">{children}</main>
      <footer className="mx-auto max-w-2xl px-8 py-12 text-sm">
        <nav>
          <ul className="flex flex-row justify-center gap-6">
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}
