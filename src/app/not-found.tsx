import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-8xl font-bold text-zinc-900 md:text-9xl dark:text-white">
            404
          </h1>
          <h2 className="mb-4 text-3xl font-bold text-zinc-900 md:text-4xl dark:text-white">
            Page not found
          </h2>
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Back to Homepage
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border-2 border-zinc-300 px-8 py-4 text-lg font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
