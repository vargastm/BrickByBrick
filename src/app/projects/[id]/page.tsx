import Link from 'next/link'
import { notFound } from 'next/navigation'

import InvestButton from '@/components/InvestButton'

import { buildings, getPexelsImage } from '../mockData'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const projectId = parseInt(id, 10)
  const project = buildings.find((building) => building.id === projectId)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      <section className="relative mt-16 flex min-h-[500px] items-center justify-center overflow-hidden border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative container max-w-7xl px-4">
          <div className="max-w-4xl">
            <Link
              href="/projects"
              className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Projects
            </Link>
            <div className="mb-4 flex items-center gap-3">
              {project.featured && (
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  Featured
                </span>
              )}
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                {project.category}
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              {project.name}
            </h1>
            <p className="mb-8 text-xl text-zinc-300 md:text-2xl">
              {project.location}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-sm text-zinc-400">Total Valuation</p>
                <p className="text-2xl font-bold text-white">
                  ${project.totalValue}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Tokens Available</p>
                <p className="text-2xl font-bold text-white">
                  ${project.tokensAvailable}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Progress</p>
                <p className="text-2xl font-bold text-white">
                  {project.progress}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                <img
                  src={getPexelsImage(project.id)}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-0 bottom-0 left-0 h-2 bg-black/20">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                Project Overview
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    Description
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
                    dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Quisquam, quos.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    Location
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {project.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                Project Milestones
              </h2>
              <div className="space-y-4">
                {Array.from({ length: project.totalMilestones }).map(
                  (_, index) => {
                    const milestoneNumber = index + 1
                    const isCompleted =
                      milestoneNumber <= project.milestonesCompleted
                    return (
                      <div
                        key={milestoneNumber}
                        className="flex items-center gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            isCompleted
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-sm font-semibold">
                              {milestoneNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              isCompleted
                                ? 'text-zinc-900 dark:text-white'
                                : 'text-zinc-500 dark:text-zinc-400'
                            }`}
                          >
                            Milestone {milestoneNumber}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {isCompleted
                              ? 'Completed'
                              : 'In progress or pending'}
                          </p>
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
                Investment Details
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Total Valuation
                    </span>
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                      ${project.totalValue}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Tokens Available
                    </span>
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                      ${project.tokensAvailable}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Progress
                    </span>
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pb-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Milestones
                    </span>
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                      {project.milestonesCompleted}/{project.totalMilestones}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <InvestButton project={project} />
                  <button className="mt-3 w-full rounded-lg border border-zinc-300 bg-white py-4 font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                    View Contract
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
