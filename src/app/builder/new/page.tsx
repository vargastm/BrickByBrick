'use client'

import { Configuration, ContractsApi } from '@curvegrid/multibaas-sdk'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import { decodeEventLog, encodeFunctionData } from 'viem'
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
const QUOTE_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_QUOTE_TOKEN_ADDRESS ||
  '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' // Default to ETH address, update as needed

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

      // await handleSubmit8(
      //   '',
      //   BigInt(2),
      //   contractsApi,
      //   '0x0B78a7484B665d2A300C57c79cb5d4E305e1C752',
      // )

      // Call the contract function using MultiBaas SDK
      const response = await contractsApi.callContractFunction(
        'buildingregistry8',
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
      await sendTransaction(
        {
          to: transaction.to as `0x${string}`,
          data: transaction.data as `0x${string}`,
          value: transaction.value ? BigInt(transaction.value) : BigInt(0),
          gas: transaction.gas ? BigInt(transaction.gas) : undefined,
          gasPrice: transaction.gasPrice
            ? BigInt(transaction.gasPrice)
            : undefined,
        },
        {
          onSuccess: (tx) => {
            console.log('tx', tx)
            handleSubmit2(tx as `0x${string}`, contractsApi)
          },
          onError: (error) => {
            console.log('error', error)
          },
        },
      )
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

  const handleSubmit2 = async (txHash: string, contractsApi: ContractsApi) => {
    // Wait for transaction receipt to get building ID
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    const buildingReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    })

    console.log('buildingReceipt', buildingReceipt)

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

    // Convert tokensAvailable to wei (assuming 18 decimals)
    // Parse the tokensAvailable string (e.g., "8.5M" -> 8500000)
    const tokensAvailableStr = formData.tokensAvailable.replace(/[^0-9.]/g, '')
    const tokensAvailableNum = parseFloat(tokensAvailableStr)
    const totalSupply = BigInt(Math.floor(tokensAvailableNum * 1e18).toString())

    // Call createBuildingToken on TokenFactory
    const tokenFactoryResponse = await contractsApi.callContractFunction(
      'buildingtokenfactory7', // Update with your MultiBaas instance name
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
    await sendTransaction(
      {
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
      },
      {
        onSuccess: (tx) => {
          console.log('tx', tx)
          handleSubmit3(tx as `0x${string}`, buildingId, contractsApi)
        },
        onError: (error) => {
          console.log('error', error)
        },
      },
    )
  }

  const handleSubmit3 = async (
    txHash: string,
    buildingId: bigint,
    contractsApi: ContractsApi,
  ) => {
    // Wait for transaction receipt to get building ID
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    const tokenReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
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

    // Step 1: Link token to building in registry
    try {
      const setTokenResponse = await contractsApi.callContractFunction(
        'buildingregistry8',
        'buildingregistry',
        'setTokenContract',
        {
          args: [buildingId.toString(), tokenAddress],
          from: address!,
        },
      )

      const setTokenResult = setTokenResponse.data.result

      if (setTokenResult.kind !== 'TransactionToSignResponse') {
        throw new Error(
          'Expected transaction to sign for setting token contract, but got method call response',
        )
      }

      const setTokenTransaction = setTokenResult.tx

      // Send set token contract transaction
      await sendTransaction(
        {
          to: setTokenTransaction.to as `0x${string}`,
          data: setTokenTransaction.data as `0x${string}`,
          value: setTokenTransaction.value
            ? BigInt(setTokenTransaction.value)
            : BigInt(0),
          gas: setTokenTransaction.gas
            ? BigInt(setTokenTransaction.gas)
            : undefined,
          gasPrice: setTokenTransaction.gasPrice
            ? BigInt(setTokenTransaction.gasPrice)
            : undefined,
        },
        {
          onSuccess: (tx) => {
            console.log('Token contract set successfully:', tx)
            // handleSubmit4(
            //   tx as `0x${string}`,
            //   buildingId,
            //   contractsApi,
            //   tokenAddress,
            // )
          },
          onError: (error) => {
            console.error('Error setting token contract:', error)
            setError('Failed to set token contract. Please try again.')
            setIsSubmitting(false)
          },
        },
      )
    } catch (err) {
      console.error('Error setting token contract:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to set token contract. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  const handleSubmit4 = async (
    txHash: string,
    buildingId: bigint,
    contractsApi: ContractsApi,
    tokenAddress: string,
  ) => {
    // Wait for set token contract transaction to complete
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    })

    console.log('Token contract linked to building')

    // Step 2: Configure sale on BuildingSaleManager
    try {
      // Calculate token price: totalValue / tokensAvailable (in wei)
      const totalValueStr = formData.totalValue.replace(/[^0-9.]/g, '')
      const totalValueNum = parseFloat(totalValueStr)
      const tokensAvailableStr = formData.tokensAvailable.replace(
        /[^0-9.]/g,
        '',
      )
      const tokensAvailableNum = parseFloat(tokensAvailableStr)

      // Token price in wei per token (assuming quote token has 18 decimals)
      // const tokenPrice = BigInt(
      //   Math.floor((totalValueNum / tokensAvailableNum) * 1e18).toString(),
      // )

      // Max tokens for sale in wei (assuming 18 decimals)
      const maxTokensForSale = BigInt(
        Math.floor(tokensAvailableNum * 1e18).toString(),
      )

      const configureSaleResponse = await contractsApi.callContractFunction(
        'buildingsalemanager6', // Update with your MultiBaas instance name
        'buildingsalemanager',
        'configureSale',
        {
          args: [
            buildingId.toString(),
            tokenAddress,
            QUOTE_TOKEN_ADDRESS,
            1,
            maxTokensForSale.toString(),
          ],
          from: address!,
        },
      )

      const configureSaleResult = configureSaleResponse.data.result

      if (configureSaleResult.kind !== 'TransactionToSignResponse') {
        throw new Error(
          'Expected transaction to sign for configuring sale, but got method call response',
        )
      }

      const configureSaleTransaction = configureSaleResult.tx

      // Send configure sale transaction
      await sendTransaction(
        {
          to: configureSaleTransaction.to as `0x${string}`,
          data: configureSaleTransaction.data as `0x${string}`,
          value: configureSaleTransaction.value
            ? BigInt(configureSaleTransaction.value)
            : BigInt(0),
          gas: configureSaleTransaction.gas
            ? BigInt(configureSaleTransaction.gas)
            : undefined,
          gasPrice: configureSaleTransaction.gasPrice
            ? BigInt(configureSaleTransaction.gasPrice)
            : undefined,
        },
        {
          onSuccess: (tx) => {
            console.log('Sale configured successfully:', tx)
            handleSubmit5(tx as `0x${string}`, buildingId, contractsApi)
          },
          onError: (error) => {
            console.error('Error configuring sale:', error)
            setError('Failed to configure sale. Please try again.')
            setIsSubmitting(false)
          },
        },
      )
    } catch (err) {
      console.error('Error configuring sale:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to configure sale. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  const handleSubmit5 = async (
    txHash: string,
    buildingId: bigint,
    contractsApi: ContractsApi,
  ) => {
    // Wait for configure sale transaction to complete
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    })

    console.log('Sale configured')

    // Step 3: Publish sale
    try {
      const publishSaleResponse = await contractsApi.callContractFunction(
        'buildingsalemanager6',
        'buildingsalemanager',
        'publishSale',
        {
          args: [buildingId.toString()],
          from: address!,
        },
      )

      const publishSaleResult = publishSaleResponse.data.result

      if (publishSaleResult.kind !== 'TransactionToSignResponse') {
        throw new Error(
          'Expected transaction to sign for publishing sale, but got method call response',
        )
      }

      const publishSaleTransaction = publishSaleResult.tx

      // Send publish sale transaction
      await sendTransaction(
        {
          to: publishSaleTransaction.to as `0x${string}`,
          data: publishSaleTransaction.data as `0x${string}`,
          value: publishSaleTransaction.value
            ? BigInt(publishSaleTransaction.value)
            : BigInt(0),
          gas: publishSaleTransaction.gas
            ? BigInt(publishSaleTransaction.gas)
            : undefined,
          gasPrice: publishSaleTransaction.gasPrice
            ? BigInt(publishSaleTransaction.gasPrice)
            : undefined,
        },
        {
          onSuccess: (tx) => {
            console.log('Sale published successfully:', tx)
            handleSubmit6(tx as `0x${string}`, buildingId, contractsApi)
          },
          onError: (error) => {
            console.error('Error publishing sale:', error)
            setError('Failed to publish sale. Please try again.')
            setIsSubmitting(false)
          },
        },
      )
    } catch (err) {
      console.error('Error publishing sale:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to publish sale. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  const handleSubmit6 = async (
    txHash: string,
    buildingId: bigint,
    contractsApi: ContractsApi,
  ) => {
    // Wait for publish sale transaction to complete
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    })

    console.log('Sale published')

    // Step 4: Open sale
    try {
      const openSaleResponse = await contractsApi.callContractFunction(
        'buildingsalemanager6',
        'buildingsalemanager',
        'openSale',
        {
          args: [buildingId.toString()],
          from: address!,
        },
      )

      const openSaleResult = openSaleResponse.data.result

      if (openSaleResult.kind !== 'TransactionToSignResponse') {
        throw new Error(
          'Expected transaction to sign for opening sale, but got method call response',
        )
      }

      const openSaleTransaction = openSaleResult.tx

      // Send open sale transaction
      await sendTransaction(
        {
          to: openSaleTransaction.to as `0x${string}`,
          data: openSaleTransaction.data as `0x${string}`,
          value: openSaleTransaction.value
            ? BigInt(openSaleTransaction.value)
            : BigInt(0),
          gas: openSaleTransaction.gas
            ? BigInt(openSaleTransaction.gas)
            : undefined,
          gasPrice: openSaleTransaction.gasPrice
            ? BigInt(openSaleTransaction.gasPrice)
            : undefined,
        },
        {
          onSuccess: (tx) => {
            console.log('Sale opened successfully:', tx)
            handleSubmit7(
              tx as `0x${string}`,
              buildingId,
              contractsApi,
              openSaleTransaction.to as `0x${string}`,
            )
          },
          onError: (error) => {
            console.error('Error opening sale:', error)
            setError('Failed to open sale. Please try again.')
            setIsSubmitting(false)
          },
        },
      )
    } catch (err) {
      console.error('Error opening sale:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to open sale. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  const handleSubmit7 = async (
    txHash: string,
    buildingId: bigint,
    contractsApi: ContractsApi,
    saleManagerAddress: `0x${string}`,
  ) => {
    // Step 4: Call configureEscrow on the sale manager contract via MultiBaas
    try {
      const configureEscrowResponse = await contractsApi.callContractFunction(
        'escrowmanager3', // MultiBaas instance name for BuildingSaleManager
        'escrowmanager',
        'configureEscrow',
        {
          args: [
            buildingId.toString(),
            '0xa5d5d2460027b1331c045951cec7579f4a90b196',
            [1, 1, 1, 1, 1, 1, 1, 1],
          ],
          from: address!,
        },
      )

      const configureEscrowResult = configureEscrowResponse.data.result

      if (configureEscrowResult.kind !== 'TransactionToSignResponse') {
        throw new Error(
          'Expected transaction to sign for escrow configuration, but got method call response',
        )
      }

      const configureEscrowTransaction = configureEscrowResult.tx

      // Send configureEscrow transaction
      await sendTransaction(
        {
          to: configureEscrowTransaction.to as `0x${string}`,
          data: configureEscrowTransaction.data as `0x${string}`,
          value: configureEscrowTransaction.value
            ? BigInt(configureEscrowTransaction.value)
            : BigInt(0),
          gas: configureEscrowTransaction.gas
            ? BigInt(configureEscrowTransaction.gas)
            : undefined,
          gasPrice: configureEscrowTransaction.gasPrice
            ? BigInt(configureEscrowTransaction.gasPrice)
            : undefined,
        },
        {
          onSuccess: (tx) => {
            console.log('Escrow configured successfully:', tx)
            handleSubmit8(
              tx as `0x${string}`,
              buildingId,
              contractsApi,
              saleManagerAddress,
            )
          },
          onError: (error) => {
            console.error('Error configuring escrow:', error)
            setError('Failed to configure escrow. Please try again.')
            setIsSubmitting(false)
          },
        },
      )
    } catch (err) {
      console.error('Error configuring escrow:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to configure escrow. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  const handleSubmit8 = async (
    txHash: string,
    buildingId: bigint,
    contractsApi: ContractsApi,
    saleManagerAddress: `0x${string}`,
  ) => {
    // Wait for open sale transaction to complete
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    })

    console.log('Sale opened, proceeding with token purchase')

    // Step 5: Approve USDC for BuildingSaleManager
    try {
      // Small purchase amount: 100 USDC (assuming 6 decimals for USDC)
      const purchaseAmount = BigInt(1) // 100 USDC with 6 decimals

      // Approve USDC token for BuildingSaleManager
      // ERC20 approve function: approve(address spender, uint256 amount)
      // Encode and send approval transaction directly
      const approveData = encodeFunctionData({
        abi: [
          {
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'approve',
        args: [saleManagerAddress, 200],
      })

      // Send approval transaction and wait for it to complete
      await new Promise<void>((resolve, reject) => {
        sendTransaction(
          {
            to: QUOTE_TOKEN_ADDRESS as `0x${string}`,
            data: approveData,
            value: BigInt(0),
          },
          {
            onSuccess: async (tx) => {
              console.log('USDC approval transaction sent:', tx)
              try {
                // Wait for approval transaction
                await publicClient.waitForTransactionReceipt({
                  hash: tx as `0x${string}`,
                })
                console.log('USDC approved successfully')

                // Step 6: Buy tokens
                const buyTokensResponse =
                  await contractsApi.callContractFunction(
                    'buildingsalemanager6',
                    'buildingsalemanager',
                    'buyTokens',
                    {
                      args: [buildingId.toString(), BigInt(1)],
                      from: address!,
                    },
                  )

                const buyTokensResult = buyTokensResponse.data.result

                if (buyTokensResult.kind !== 'TransactionToSignResponse') {
                  throw new Error(
                    'Expected transaction to sign for buying tokens, but got method call response',
                  )
                }

                const buyTokensTransaction = buyTokensResult.tx

                // Send buy tokens transaction
                await sendTransaction(
                  {
                    to: buyTokensTransaction.to as `0x${string}`,
                    data: buyTokensTransaction.data as `0x${string}`,
                    value: buyTokensTransaction.value
                      ? BigInt(buyTokensTransaction.value)
                      : BigInt(0),
                    gas: buyTokensTransaction.gas
                      ? BigInt(buyTokensTransaction.gas)
                      : undefined,
                    gasPrice: buyTokensTransaction.gasPrice
                      ? BigInt(buyTokensTransaction.gasPrice)
                      : undefined,
                  },
                  {
                    onSuccess: (tx) => {
                      console.log('Tokens purchased successfully:', tx)
                      // All transactions completed successfully
                      setIsSubmitting(false)
                      router.push('/builder')
                    },
                    onError: (error) => {
                      console.error('Error buying tokens:', error)
                      setError('Failed to buy tokens. Please try again.')
                      setIsSubmitting(false)
                    },
                  },
                )
                resolve()
              } catch (error) {
                reject(error)
              }
            },
            onError: (error) => {
              console.error('Error approving USDC:', error)
              reject(error)
            },
          },
        )
      })
    } catch (err) {
      console.error('Error in token purchase flow:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to complete token purchase. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash && receipt) {
      setIsSubmitting(false)
      // alert('Project created successfully!')
      // router.push('/builder')
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
