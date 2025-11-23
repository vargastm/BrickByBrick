'use client'

import { Configuration, ContractsApi } from '@curvegrid/multibaas-sdk'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import { decodeEventLog } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'

import BuildingRegistryABI from '../../../../abi/BuildingRegistry.json'
import BuildingTokenFactoryABI from '../../../../abi/BuildingTokenFactory.json'

// MultiBaas configuration - these should be set as environment variables
const MULTIBAAS_HOST = process.env.NEXT_PUBLIC_MULTIBAAS_HOST || ''
const MULTIBAAS_API_KEY = process.env.NEXT_PUBLIC_MULTIBAAS_API_KEY || ''
const DEFAULT_ORACLE_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_ADDRESS || ''
const TOKEN_FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS || ''

export default function NewProjectPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const publicClient = usePublicClient()
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: 'Residential',
    totalValue: '',
    tokensAvailable: '',
    tokenName: '',
    tokenSymbol: '',
    totalMilestones: '8',
    featured: false,
    description: '',
    oracleAddress: DEFAULT_ORACLE_ADDRESS,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    data: hash,
    sendTransaction,
    isPending: isPendingTransaction,
  } = useSendTransaction()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!address) {
        throw new Error('Wallet not connected')
      }

      if (!formData.oracleAddress) {
        throw new Error('Oracle address is required')
      }

      if (!MULTIBAAS_HOST || !MULTIBAAS_API_KEY) {
        throw new Error(
          'MultiBaas configuration is missing. Please set NEXT_PUBLIC_MULTIBAAS_HOST and NEXT_PUBLIC_MULTIBAAS_API_KEY environment variables.',
        )
      }

      const metadataURI =
        'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
      // const metadataURI = JSON.stringify(metadata)

      // Initialize MultiBaas client
      const configuration = new Configuration({
        basePath: MULTIBAAS_HOST,
        accessToken: MULTIBAAS_API_KEY,
      })
      const contractsApi = new ContractsApi(configuration)

      // Call the contract function using MultiBaas SDK
      const response = await contractsApi.callContractFunction(
        'buildingregistry4',
        'buildingregistry',
        'createBuilding',
        {
          args: [
            formData.name,
            metadataURI,
            address,
            formData.oracleAddress,
            parseInt(formData.totalMilestones, 10),
            formData.description,
            formData.location,
            formData.featured,
          ],
          from: address,
        },
      )

      const result = response.data.result

      // Check if we got a transaction to sign
      if (result.kind !== 'TransactionToSignResponse') {
        throw new Error(
          'Expected transaction to sign, but got method call response',
        )
      }

      const transaction = result.tx

      // Send the transaction using wagmi
      const txHash = (await sendTransaction({
        to: transaction.to as `0x${string}`,
        data: transaction.data as `0x${string}`,
        value: transaction.value ? BigInt(transaction.value) : BigInt(0),
        gas: transaction.gas ? BigInt(transaction.gas) : undefined,
        gasPrice: transaction.gasPrice
          ? BigInt(transaction.gasPrice)
          : undefined,
      })) as unknown as `0x${string}`

      // Wait for transaction receipt to get building ID
      if (!publicClient) {
        throw new Error('Public client not available')
      }

      const buildingReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      })

      // Extract building ID from BuildingCreated event
      let buildingId: bigint | null = null
      if (buildingReceipt.logs) {
        for (const log of buildingReceipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: BuildingRegistryABI.abi as any,
              data: log.data,
              topics: log.topics,
            }) as { eventName: string; args: { buildingId?: bigint } }

            console.log('decoded', decoded)
            if (
              decoded.eventName === 'BuildingCreated' &&
              decoded.args.buildingId
            ) {
              buildingId = decoded.args.buildingId
              break
            }
          } catch {
            // Not the event we're looking for, continue
            continue
          }
        }
      }

      if (!buildingId) {
        throw new Error('Failed to extract building ID from transaction')
      }

      console.log('Building ID:', buildingId.toString())

      // TOKEN FACTORY - CREATE TOKEN
      if (!TOKEN_FACTORY_ADDRESS) {
        throw new Error('Token factory address is not configured')
      }

      // Convert tokensAvailable to wei (assuming 18 decimals)
      // Parse the tokensAvailable string (e.g., "8.5M" -> 8500000)
      const tokensAvailableStr = formData.tokensAvailable.replace(
        /[^0-9.]/g,
        '',
      )
      const tokensAvailableNum = parseFloat(tokensAvailableStr)
      const totalSupply = BigInt(
        Math.floor(tokensAvailableNum * 1e18).toString(),
      )

      // Call createBuildingToken on TokenFactory
      const tokenFactoryResponse = await contractsApi.callContractFunction(
        'buildingtokenfactory2', // Update with your MultiBaas instance name
        'buildingtokenfactory',
        'createBuildingToken',
        {
          args: [
            buildingId.toString(),
            formData.tokenName,
            formData.tokenSymbol,
            totalSupply.toString(),
            address,
          ],
          from: address,
        },
      )

      const tokenFactoryResult = tokenFactoryResponse.data.result

      if (tokenFactoryResult.kind !== 'TransactionToSignResponse') {
        throw new Error(
          'Expected transaction to sign for token creation, but got method call response',
        )
      }

      const tokenFactoryTransaction = tokenFactoryResult.tx
      console.log('tokenFactoryTransaction', tokenFactoryTransaction)

      // Send token creation transaction
      const tokenFactoryTxHash = (await sendTransaction({
        to: tokenFactoryTransaction.to as `0x${string}`,
        data: tokenFactoryTransaction.data as `0x${string}`,
        value: tokenFactoryTransaction.value
          ? BigInt(tokenFactoryTransaction.value)
          : BigInt(0),
        gas: tokenFactoryTransaction.gas
          ? BigInt(tokenFactoryTransaction.gas)
          : undefined,
        gasPrice: tokenFactoryTransaction.gasPrice
          ? BigInt(tokenFactoryTransaction.gasPrice)
          : undefined,
      })) as unknown as `0x${string}`

      // Wait for token creation transaction
      const tokenReceipt = await publicClient.waitForTransactionReceipt({
        hash: tokenFactoryTxHash,
      })

      // Extract token address from BuildingTokenCreated event
      let tokenAddress: string | null = null
      if (tokenReceipt.logs) {
        for (const log of tokenReceipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: BuildingTokenFactoryABI.abi as any,
              data: log.data,
              topics: log.topics,
            }) as { eventName: string; args: { tokenAddress?: string } }

            if (
              decoded.eventName === 'BuildingTokenCreated' &&
              decoded.args.tokenAddress
            ) {
              tokenAddress = decoded.args.tokenAddress
              break
            }
          } catch {
            // Not the event we're looking for, continue
            continue
          }
        }
      }

      if (!tokenAddress) {
        throw new Error('Failed to extract token address from transaction')
      }

      console.log('Token Address:', tokenAddress)

      // PUBLISH TOKEN
      // TODO: Implement publish token method when contract method is available
      // This might be a method on the token contract or registry
      console.log('Publish token - to be implemented')

      // OPEN SALE
      // TODO: Implement open sale method when contract method is available
      // This might be a method on the token contract or a separate sale contract
      console.log('Open sale - to be implemented')
    } catch (err) {
      console.error('Error creating building:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create building. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash && receipt) {
      setIsSubmitting(false)
      alert('Project created successfully!')
      router.push('/builder')
    }
  }, [isConfirmed, hash, receipt, router])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

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
        <div className="relative container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl">
            <Link
              href="/builder"
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
              Back to Dashboard
            </Link>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              New Project
            </h1>
            <p className="text-xl text-zinc-300 md:text-2xl">
              Register a new construction project for tokenization
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Luxury Tower"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Manhattan, USA"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 pr-10 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="totalMilestones"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Total Milestones *
                  </label>
                  <input
                    type="number"
                    id="totalMilestones"
                    name="totalMilestones"
                    required
                    min="1"
                    value={formData.totalMilestones}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project..."
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
              Financial Information
            </h2>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="tokenName"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Token Name *
                  </label>
                  <input
                    type="text"
                    id="tokenName"
                    name="tokenName"
                    maxLength={25}
                    required
                    value={formData.tokenName}
                    onChange={handleChange}
                    placeholder="e.g., Luxury Tower Token"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tokenSymbol"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Token Symbol *
                  </label>
                  <input
                    type="text"
                    id="tokenSymbol"
                    name="tokenSymbol"
                    maxLength={3}
                    required
                    value={formData.tokenSymbol}
                    onChange={handleChange}
                    placeholder="e.g., LTT"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="totalValue"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Total Valuation *
                  </label>
                  <input
                    type="text"
                    id="totalValue"
                    name="totalValue"
                    required
                    value={formData.totalValue}
                    onChange={handleChange}
                    placeholder="e.g., 25M"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tokensAvailable"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Tokens Available *
                  </label>
                  <input
                    type="text"
                    id="tokensAvailable"
                    name="tokensAvailable"
                    required
                    value={formData.tokensAvailable}
                    onChange={handleChange}
                    placeholder="e.g., 8.5M"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
              Additional Options
            </h2>
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-zinc-300 text-black focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mark as Featured Project
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          )}

          {isPendingTransaction && (
            <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Transaction pending... Please confirm in your wallet.
              </p>
            </div>
          )}

          {isConfirming && (
            <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Waiting for transaction confirmation...
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/builder"
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-center font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isPendingTransaction || isConfirming}
              className="flex-1 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isSubmitting || isPendingTransaction || isConfirming
                ? 'Creating...'
                : 'Create Project'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
