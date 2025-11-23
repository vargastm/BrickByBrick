'use client'

import * as MultiBaas from '@curvegrid/multibaas-sdk'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { getPexelsImage } from './mockData'

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

export default function Buildings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [debugError, setDebugError] = useState<string | null>(null)

  const config = new MultiBaas.Configuration({
    basePath: process.env.NEXT_PUBLIC_MULTIBAAS_HOST || '',
    accessToken: process.env.NEXT_PUBLIC_MULTIBAAS_API_KEY,
  })
  const contractsApi = new MultiBaas.ContractsApi(config)
  const deployedAddressOrAlias = 'buildingregistry4'
  const contractLabel = 'buildingregistry'

  useEffect(() => {
    const fetchBlockchainData = async () => {
      setIsLoading(true)
      setDebugError(null)

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
        let msg = 'Erro desconhecido'
        if (isAxiosError(e)) {
          msg = `Erro API: ${e.response?.data?.message || e.message}`
          console.error('❌ Erro MultiBaas:', e.response?.data)
        } else {
          msg = String(e)
          console.error('❌ Erro JS:', e)
        }
        setDebugError(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlockchainData()
  }, [])

  const filteredBuildings = useMemo(() => {
    let filtered = buildings

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(
        (building) => building.category === selectedCategory,
      )
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (building) =>
          building.name.toLowerCase().includes(term) ||
          building.location.toLowerCase().includes(term) ||
          building.category.toLowerCase().includes(term),
      )
    }

    return filtered
  }, [searchTerm, selectedCategory, buildings])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      {debugError && (
        <div className="w-full bg-red-500 p-2 text-center text-sm font-bold text-white">
          DEBUG: {debugError}
        </div>
      )}

      <section className="relative mt-16 flex h-64 items-center justify-center overflow-hidden border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black p-0 dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative container mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Construction Projects
            </h1>
            <p className="text-xl text-zinc-300 md:text-2xl">
              Invest in tokenized construction projects with onchain milestones
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative max-w-md flex-1">
                <svg
                  className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search construction projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pr-4 pl-10 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 pr-10 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                >
                  <option>All Categories</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Projetos */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Active Construction Projects
            </h2>
            {isLoading ? (
              <div className="mt-1 h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
            ) : (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {`${filteredBuildings.length} tokenized projects`}
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                  <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="absolute top-4 right-4 h-6 w-20 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="absolute right-0 bottom-0 left-0 h-1.5 bg-zinc-200 dark:bg-zinc-700">
                    <div className="h-full w-3/4 animate-pulse bg-zinc-300 dark:bg-zinc-600"></div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                  </div>

                  <div className="mb-1 h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>

                  <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>

                  <div className="mb-3 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                      <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    </div>
                  </div>

                  <div className="h-12 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuildings.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  No projects found
                </p>
              </div>
            ) : (
              filteredBuildings.map((building) => (
                <div
                  key={building.id}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    <img
                      src={getPexelsImage(building.id)}
                      alt={building.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    {building.featured && (
                      <div className="absolute top-4 left-4 z-10 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-black shadow-lg backdrop-blur-sm dark:bg-zinc-800/90 dark:text-white">
                      {building.progress}% Complete
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 h-1.5 bg-black/20">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${building.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {building.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">
                          {building.milestonesCompleted}/
                          {building.totalMilestones} Milestones
                        </span>
                      </div>
                    </div>

                    <h3 className="mb-1 text-xl font-bold text-zinc-900 dark:text-white">
                      {building.name}
                    </h3>
                    <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {building.location}
                    </p>

                    <div className="mb-3 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Total Valuation
                        </span>
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">
                          ${building.totalValue}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/projects/${building.id}`}
                      className="block w-full rounded-lg bg-black py-3 text-center font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  )
}
