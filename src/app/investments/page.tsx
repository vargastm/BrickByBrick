'use client'

import * as MultiBaas from '@curvegrid/multibaas-sdk'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAccount } from 'wagmi'

import { useTheme } from '@/contexts/ThemeContext'

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

export default function InvestmentsPage() {
  const { theme } = useTheme()
  const { isConnected } = useAccount()
  const router = useRouter()
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    if (isConnected) {
      fetchBlockchainData()
    }
  }, [isConnected])

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  // Mock investment data for display
  const totalInvested = 560000
  const totalCurrentValue = 639000
  const totalReturn = ((totalCurrentValue - totalInvested) / totalInvested) * 100
  const totalProfit = totalCurrentValue - totalInvested
  const portfolioHistory = [
    { date: '2025-01-01', value: 125000, invested: 125000 },
    { date: '2025-02-01', value: 135000, invested: 125000 },
    { date: '2025-03-01', value: 223000, invested: 210000 },
    { date: '2025-04-01', value: 455000, invested: 410000 },
    { date: '2025-05-01', value: 575000, invested: 560000 },
    { date: '2025-06-01', value: 605000, invested: 560000 },
    { date: '2025-07-01', value: 639000, invested: 560000 },
  ]

  const isDark = theme === 'dark'
  const tickColor = isDark ? '#ffffff' : '#52525b'
  const strokeColor = isDark ? '#71717a' : '#a1a1aa'

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      <section className="relative mt-16 flex h-64 items-center justify-center overflow-hidden border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black p-0 dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative container mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              My Investments
            </h1>
            <p className="text-xl text-zinc-300 md:text-2xl">
              Track your tokenized construction investments and portfolio
              performance
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Total Invested
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">
              ${totalInvested.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Current Value
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">
              ${totalCurrentValue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Total Return
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                {totalReturn.toFixed(1)}%
              </p>
              <span
                className={`text-sm font-medium ${
                  totalReturn >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {totalReturn >= 0 ? '↑' : '↓'}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
              Total Profit
            </p>
            <p
              className={`text-3xl font-bold ${
                totalProfit >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              ${totalProfit >= 0 ? '+' : ''}
              {totalProfit.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
            Portfolio Performance
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={portfolioHistory}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="currentColor"
                      stopOpacity={0.3}
                      className="text-black dark:text-white"
                    />
                    <stop
                      offset="95%"
                      stopColor="currentColor"
                      stopOpacity={0}
                      className="text-black dark:text-white"
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorInvested"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="currentColor"
                      stopOpacity={0.2}
                      className="text-zinc-400"
                    />
                    <stop
                      offset="95%"
                      stopColor="currentColor"
                      stopOpacity={0}
                      className="text-zinc-400"
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fill: tickColor, fontSize: 12 }}
                  stroke={strokeColor}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fill: tickColor, fontSize: 12 }}
                  stroke={strokeColor}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                          <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {formatDate(payload[0].payload.date)}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-black dark:bg-white"></div>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                Current Value:
                              </span>
                              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                {formatCurrency(payload[0].value as number)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-zinc-400"></div>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                Invested:
                              </span>
                              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                {formatCurrency(payload[1].value as number)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="currentColor"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInvested)"
                  className="text-zinc-400"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="currentColor"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  className="text-black dark:text-white"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-black dark:bg-white"></div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Current Value
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-zinc-400"></div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Total Invested
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="mt-9 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Active Investments
              </h2>
              {isLoading ? (
                <div className="mt-1 h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
              ) : (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {buildings.length} projects in your portfolio
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="grid gap-6 p-6 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 md:h-full dark:from-zinc-800 dark:to-zinc-900">
                        <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-700"></div>
                      </div>
                    </div>
                    <div className="md:col-span-9">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                          </div>
                          <div className="mb-1 h-7 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                          <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                        </div>
                        <div className="text-right">
                          <div className="mb-1 h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                          <div className="h-8 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i}>
                            <div className="mb-1 h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                            <div className="h-6 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : buildings.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  No investments found
                </p>
              </div>
            ) : (
              buildings.map((building) => {
                // Mock investment data for each building
                const amountInvested = 125000 + building.id * 15000
                const currentValue = amountInvested * 1.15
                const profit = currentValue - amountInvested
                const returnPercentage = ((profit / amountInvested) * 100)
                const tokensOwned = (amountInvested / 0.25).toLocaleString()
                const investmentDate = new Date(2025, building.id % 12, 15).toISOString().split('T')[0]

                return (
                  <Link
                    key={building.id}
                    href={`/projects/${building.id}`}
                    className="group block"
                  >
                    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="grid gap-6 p-6 md:grid-cols-12">
                        <div className="md:col-span-3">
                          <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 md:h-full dark:from-zinc-800 dark:to-zinc-900">
                            <img
                              src={getPexelsImage(building.id)}
                              alt={building.name}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/20">
                              <div
                                className="h-full bg-white transition-all duration-500"
                                style={{
                                  width: `${building.progress}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-9">
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                {building.featured && (
                                  <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-black">
                                    Featured
                                  </span>
                                )}
                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                  {building.category}
                                </span>
                              </div>
                              <h3 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-white">
                                {building.name}
                              </h3>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {building.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="mb-1 text-sm text-zinc-600 dark:text-zinc-400">
                                Return
                              </p>
                              <p
                                className={`text-2xl font-bold ${
                                  returnPercentage >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {returnPercentage >= 0 ? '+' : ''}
                                {returnPercentage.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Invested
                              </p>
                              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                                ${amountInvested.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Current Value
                              </p>
                              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                                ${currentValue.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Tokens Owned
                              </p>
                              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                                {tokensOwned}
                              </p>
                            </div>
                            <div>
                              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Profit/Loss
                              </p>
                              <p
                                className={`text-lg font-semibold ${
                                  profit >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                  Progress
                                </p>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                    <div
                                      className="h-full bg-black transition-all duration-500 dark:bg-white"
                                      style={{
                                        width: `${building.progress}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    {building.progress}%
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                  Milestones
                                </p>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                  {building.milestonesCompleted}/
                                  {building.totalMilestones}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Invested on
                              </p>
                              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {new Date(
                                  investmentDate,
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
