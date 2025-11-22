import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="absolute top-0 z-50 w-full bg-zinc-200 dark:bg-zinc-900 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              ByB
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <ConnectButton />
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
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
  );
}

