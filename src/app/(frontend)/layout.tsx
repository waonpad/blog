import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 dark:text-gray-100">
      <header className="container mx-auto max-w-2xl px-8 py-12">
        <nav>
          <p>
            <Link
              href="/"
              className="font-bold text-gray-900 visited:text-gray-900 dark:text-gray-300 dark:visited:text-gray-300"
            >
              {/* TODO: 後で変更する */}
              My Blog
            </Link>
          </p>
        </nav>
      </header>
      <main className="container mx-auto max-w-2xl bg-white px-8 py-12 shadow-md dark:bg-gray-900">{children}</main>
      <footer className="container mx-auto max-w-2xl px-8 py-12 text-sm">
        <nav>
          <ul className="flex flex-row justify-center gap-6">
            <li>
              <Link
                href="/"
                className="text-gray-900 visited:text-gray-900 dark:text-gray-300 dark:visited:text-gray-300"
              >
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}
