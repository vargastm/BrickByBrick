'use client'

import { type ChangeEvent, useRef, useState } from 'react'

import ValidationModal from './ValidationModal'

interface MilestoneUploadButtonProps {
  milestoneNumber: number
  projectId: number
}

export default function MilestoneUploadButton({
  milestoneNumber: _milestoneNumber,
  projectId,
}: MilestoneUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setUploadError(null)
      setUploadSuccess(false)
      setIsModalOpen(true)
      handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('building_id', projectId.toString())

      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message ||
            errorData.error ||
            `Error uploading file: ${response.status} ${response.statusText}`,
        )
      }

      const data = await response.json()
      console.log('Upload response:', data)

      if (data.is_valid === false || data.is_valid === 'false') {
        throw new Error(
          data.message ||
            data.error ||
            'The file did not pass the validation. Please check the file and try again.',
        )
      }

      if (data.is_valid === true || data.is_valid === 'true') {
        setUploadSuccess(true)
      } else {
        throw new Error(
          data.message ||
            data.error ||
            'Invalid validation response. Please try again.',
        )
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Error uploading file. Please try again.',
      )
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseModal = () => {
    if (!isUploading) {
      setIsModalOpen(false)
      if (uploadSuccess || uploadError) {
        setUploadedFile(null)
        setUploadError(null)
        setUploadSuccess(false)
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className="mt-3 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <button
          onClick={handleButtonClick}
          disabled={isUploading || uploadSuccess}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {uploadSuccess ? (
            <>
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
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
              <span className="text-green-600 dark:text-green-400">
                Validated
              </span>
            </>
          ) : (
            <>
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Validate</span>
            </>
          )}
        </button>
      </div>

      <ValidationModal
        isOpen={isModalOpen}
        fileName={uploadedFile?.name || null}
        isProcessing={isUploading}
        error={uploadError}
        onClose={handleCloseModal}
      />
    </>
  )
}
