'use client'

import { useEffect, useState } from 'react'

import { type Building } from '@/app/projects/mockData'

interface InvestModalProps {
  project: Building
  isOpen: boolean
  onClose: () => void
  onInvest: (amount: number, tokens: number) => Promise<void>
}

export default function InvestModal({
  project,
  isOpen,
  onClose,
  onInvest,
}: InvestModalProps) {
  const [tokenAmount, setTokenAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalValueNum =
    typeof project.totalValue === 'number'
      ? project.totalValue
      : parseFloat(project.totalValue.replace(/[^0-9.]/g, ''))

  const tokensAvailableNum =
    typeof project.tokensAvailable === 'number'
      ? project.tokensAvailable
      : parseFloat(project.tokensAvailable.replace(/[^0-9.]/g, ''))
  const pricePerToken = totalValueNum / tokensAvailableNum

  const tokenAmountNum = parseFloat(tokenAmount) || 0
  const totalValue = tokenAmountNum * pricePerToken

  const maxTokens = tokensAvailableNum

  const handleInvest = async () => {
    if (!tokenAmount || tokenAmountNum <= 0) {
      setError('Please enter a valid token amount')
      return
    }

    if (tokenAmountNum > maxTokens) {
      setError(`Maximum available: ${maxTokens.toLocaleString()} tokens`)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await onInvest(totalValue, tokenAmountNum)
      setTokenAmount('')
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error processing investment',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTokenAmount('')
      setError(null)
      onClose()
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isLoading])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close modal"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invest-modal-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <h2
            id="invest-modal-title"
            className="text-2xl font-bold text-zinc-900 dark:text-white"
          >
            Invest in {project.name}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Location
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {project.location}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Total Project Value
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                ${project.totalValue}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Tokens Available
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {maxTokens.toLocaleString()} tokens
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="tokenAmount"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Token Amount *
            </label>
            <div className="relative">
              <input
                type="number"
                id="tokenAmount"
                value={tokenAmount}
                onChange={(e) => {
                  const value = e.target.value
                  if (
                    value === '' ||
                    (!isNaN(Number(value)) && Number(value) >= 0)
                  ) {
                    setTokenAmount(value)
                    setError(null)
                  }
                }}
                placeholder="0"
                min="0"
                max={maxTokens}
                step="1"
                disabled={isLoading}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-lg font-semibold transition-all focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
              />
              <button
                onClick={() => setTokenAmount(maxTokens.toString())}
                disabled={isLoading}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                MAX
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Maximum: {maxTokens.toLocaleString()} tokens
            </p>
          </div>

          <div className="mb-6 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Price per Token
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                ${pricePerToken.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <span className="text-base font-semibold text-zinc-900 dark:text-white">
                Total Value
              </span>
              <span className="text-xl font-bold text-zinc-900 dark:text-white">
                $
                {totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleInvest}
              disabled={isLoading || !tokenAmount || tokenAmountNum <= 0}
              className="flex-1 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
