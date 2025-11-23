'use client'

import * as MultiBaas from '@curvegrid/multibaas-sdk'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { getPexelsImage } from './projects/mockData'

interface Building {
  id: number
  name: string
  location: string
  category: string
  progress: number
  milestonesCompleted: number
  totalMilestones: number
  totalValue: string
  tokensAvailable: string
  featured: boolean
  description: string
  status: number
}

export default function Home() {
  const { isConnected } = useAccount()
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const config = new MultiBaas.Configuration({
    basePath: process.env.NEXT_PUBLIC_MULTIBAAS_HOST || '',
    accessToken: process.env.NEXT_PUBLIC_MULTIBAAS_API_KEY,
  })
  const contractsApi = new MultiBaas.ContractsApi(config)
  const deployedAddressOrAlias = 'buildingregistry8'
  const contractLabel = 'buildingregistry'

  useEffect(() => {
    const fetchBlockchainData = async () => {
      setIsLoading(true)

      try {
        const totalResp = await contractsApi.callContractFunction(
          deployedAddressOrAlias,
          contractLabel,
          'getTotalBuildings',
          { args: [] },
        )

        const totalResult = totalResp.data.result as any
        const totalRaw = totalResult.output
        const totalCount = Number(totalRaw)

        if (isNaN(totalCount) || totalCount <= 0) {
          setBuildings([])
          return
        }

        const promises = []
        for (let i = 1; i <= totalCount; i++) {
          promises.push(
            contractsApi.callContractFunction(
              deployedAddressOrAlias,
              contractLabel,
              'getBuilding',
              { args: [i.toString()] },
            ),
          )
        }

        const results = await Promise.all(promises)

        const formattedBuildings: Building[] = results.map((res: any) => {
          const outputs = res.data.result.output

          const currentMilestone = Number(outputs[8])
          const totalMilestones = Number(outputs[7])
          const progressCalc =
            totalMilestones > 0
              ? Math.round((currentMilestone / totalMilestones) * 100)
              : 0

          return {
            id: Number(outputs[0]),
            name: String(outputs[1]),
            description: String(outputs[11]),
            location: String(outputs[12]),
            featured: Boolean(outputs[10]),
            status: Number(outputs[6]),

            milestonesCompleted: currentMilestone,
            totalMilestones: totalMilestones,
            progress: progressCalc,

            category: 'Comercial',
            totalValue: '1,500,000',
            tokensAvailable: '50,000',
          }
        })

        setBuildings(formattedBuildings)
      } catch (e) {
        if (isAxiosError(e)) {
          console.error('❌ Erro MultiBaas:', e.response?.data)
        } else {
          console.error('❌ Erro JS:', e)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlockchainData()
  }, [])

  const featuredProjects = buildings.filter((b) => b.featured).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      <section className="relative mt-16 flex min-h-[600px] items-center justify-center overflow-hidden border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Build the Future,
              <br />
              Brick by Brick
            </h1>
            <p className="mb-8 text-xl text-zinc-300 md:text-2xl">
              For <strong>builders</strong> who need liquidity without
              discounting units.
              <br />
              For <strong>investors</strong> wanting safe, liquid, accessible
              real estate.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/projects"
                className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-zinc-200"
              >
                Explore Projects
              </Link>
              {isConnected && (
                <Link
                  href="/investments"
                  className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  View Investments
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            Why Choose BrickByBrick?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Revolutionizing real estate investment through blockchain technology
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
              Tokenized Funding
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Finance projects transparently through blockchain tokenization.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
              Accessible Investments
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Invest in real estate with a low entry ticket and fractional
              tokens.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
              AI-Verified Escrow Security
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Funds release only after AI-validated, on-chain construction
              progress.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
              Built for Builders. Designed for Investors.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
                For Builders
              </h3>
              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Raise capital without sacrificing margins.
              </p>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                BrickByBrick gives you liquidity, faster funding rounds, and
                milestone-based releases that protect your cash flow.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
                For Investors
              </h3>
              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Access premium real estate with a low entry ticket.
              </p>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Invest with on-chain safety, transparency, and guaranteed
                liquidity on secondary markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
              Featured Projects
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Discover our most promising tokenized construction projects
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 h-5 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="mb-1 h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="mb-3 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                        <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredProjects.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  No featured projects available
                </p>
              </div>
            ) : (
              featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                      <img
                        src={getPexelsImage(project.id)}
                        alt={project.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                      <div className="absolute top-4 left-4 z-10 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                        Featured
                      </div>
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
                            {project.milestonesCompleted}/
                            {project.totalMilestones} Milestones
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
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-block rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-zinc-900 dark:text-white">
                {buildings.length}+
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Active Projects
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-zinc-900 dark:text-white">
                $330M+
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Total Valuation
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-zinc-900 dark:text-white">
                100%
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Onchain Verified
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-zinc-900 dark:text-white">
                24/7
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Real-time Updates
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Ready to Start Investing?
            </h2>
            <p className="mb-8 max-w-2xl text-xl text-zinc-300">
              Join the future of real estate investment with blockchain-powered
              transparency and AI-driven insights
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/projects"
                className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-zinc-200"
              >
                Browse Projects
              </Link>
              {isConnected && (
                <Link
                  href="/builder"
                  className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  List Your Project
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
