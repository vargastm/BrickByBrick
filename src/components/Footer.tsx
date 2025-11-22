import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-300 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <Link
                href="/"
                className="text-xl font-bold text-black transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
              >
                Brick By Brick
              </Link>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Building the future, one brick at a time.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black dark:text-zinc-50">
                Links
              </h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Projects
                </Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black dark:text-zinc-50">
                Contact
              </h3>
              <div className="flex flex-col space-y-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  GitHub
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-300 pt-6 dark:border-zinc-800">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-zinc-600 md:flex-row dark:text-zinc-400">
              <div>
                <p>Made with 🧡 in ETHGlobal Buenos Aires 2025.</p>
                <p> © {currentYear} BrickByBrick. All rights reserved.</p>
              </div>
              <div className="flex gap-6">
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-black dark:hover:text-zinc-200"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-black dark:hover:text-zinc-200"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
