'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import { buildings, getPexelsImage } from '../projects/mockData'

export default function BuilderDashboard() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const myProjects = buildings.filter((b) => b.id <= 3)

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      <section className="relative mt-16 flex h-64 items-center justify-center overflow-hidden border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black p-0 dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative container mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Builder Dashboard
            </h1>
            <p className="text-xl text-zinc-300 md:text-2xl">
              Manage your construction projects and tokenize new developments
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-12">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Active Projects
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">
              {myProjects.length}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Total Value
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">
              $95M
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Tokens Sold
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">
              $35.5M
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              My Projects
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage and track your construction projects
            </p>
          </div>
          <Link
            href="/builder/new"
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            + New Project
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {myProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                <img
                  src={getPexelsImage(project.id)}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-black shadow-lg backdrop-blur-sm dark:bg-zinc-800/90 dark:text-white">
                  {project.progress}% Complete
                </div>
                <div className="absolute right-0 bottom-0 left-0 h-1.5 bg-black/20">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {project.milestonesCompleted}/{project.totalMilestones}{' '}
                      Milestones
                    </span>
                  </div>
                </div>

                <h3 className="mb-1 text-xl font-bold text-zinc-900 dark:text-white">
                  {project.name}
                </h3>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {project.location}
                </p>

                <div className="mb-3 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Total Valuation
                    </span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      ${project.totalValue}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Tokens Available
                    </span>
                    <span className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                      ${project.tokensAvailable}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white py-2.5 text-center text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    View
                  </Link>
                  <button className="flex-1 rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
