'use client'

import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

interface ValidationModalProps {
  isOpen: boolean
  fileName: string | null
  isProcessing: boolean
  error: string | null
  onClose: () => void
}

export default function ValidationModal({
  isOpen,
  fileName,
  isProcessing,
  error,
  onClose,
}: ValidationModalProps) {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    if (isProcessing && !animationData) {
      fetch('/assets/cloud-robotic.json')
        .then((res) => res.json())
        .then((data) => setAnimationData(data))
        .catch((err) => console.error('Error loading animation:', err))
    }
  }, [isProcessing, animationData])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isProcessing, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        disabled={isProcessing}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm disabled:cursor-not-allowed"
        aria-label="Close modal"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="validation-modal-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <h2
            id="validation-modal-title"
            className="text-2xl font-bold text-zinc-900 dark:text-white"
          >
            Validating File
          </h2>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
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
          )}
        </div>

        <div className="p-6">
          {fileName && (
            <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-3">
                <svg
                  className="h-8 w-8 shrink-0 text-zinc-400 dark:text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {fileName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    File uploaded
                  </p>
                </div>
              </div>
            </div>
          )}

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 h-48 w-48">
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg
                      className="h-12 w-12 animate-spin text-black dark:text-white"
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
                  </div>
                )}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                Our agents are verifying your file
              </h3>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Please wait while we analyze and validate the uploaded document.
                This may take a few moments.
              </p>
            </div>
          ) : error ? (
            <div>
              <div className="mb-4 flex items-center justify-center">
                <svg
                  className="h-16 w-16 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold text-red-600 dark:text-red-400">
                Validation Failed
              </h3>
              <p className="mx-auto mb-6 max-w-60 text-center text-sm text-zinc-600 dark:text-zinc-400">
                {error}
              </p>
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Close
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-center">
                <svg
                  className="h-16 w-16 text-green-600 dark:text-green-400"
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
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold text-green-600 dark:text-green-400">
                Validation Successful
              </h3>
              <p className="mb-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Your file has been successfully validated by our agents.
              </p>
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
