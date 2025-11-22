import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-zinc-200 backdrop-blur-sm dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold text-black transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
            >
              ByB
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Projects
            </Link>
          </div>

          <nav className="hidden items-center gap-4 md:flex">
            <ConnectButton />
            <ThemeToggle />
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
