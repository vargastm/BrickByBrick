'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { isConnected } = useAccount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-zinc-200 backdrop-blur-sm dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-3xl font-bold text-black transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
              onClick={closeMobileMenu}
            >
              ByB
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/projects"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Projects
              </Link>
              {isConnected && (
                <>
                  <Link
                    href="/investments"
                    className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    My Investments
                  </Link>
                  <Link
                    href="/builder"
                    className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    Builder
                  </Link>
                </>
              )}
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                How it Works
              </Link>
            </div>
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
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
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
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                closeMobileMenu()
              }
            }}
          />
          <div className="fixed top-16 right-0 left-0 z-50 border-t border-zinc-300 bg-zinc-200 md:hidden dark:border-zinc-700 dark:bg-zinc-900">
            <div className="border-b border-zinc-300 p-4 dark:border-zinc-700">
              <ConnectButton />
            </div>
            <nav className="container mx-auto flex flex-col border-b border-zinc-300 px-4 py-4 dark:border-zinc-700">
              <Link
                href="/projects"
                className="py-3 text-base font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                onClick={closeMobileMenu}
              >
                Projects
              </Link>
              {isConnected && (
                <>
                  <Link
                    href="/investments"
                    className="py-3 text-base font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                    onClick={closeMobileMenu}
                  >
                    My Investments
                  </Link>
                  <Link
                    href="/builder"
                    className="py-3 text-base font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                    onClick={closeMobileMenu}
                  >
                    Builder
                  </Link>
                </>
              )}
              <Link
                href="/how-it-works"
                className="py-3 text-base font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                onClick={closeMobileMenu}
              >
                How it Works
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
