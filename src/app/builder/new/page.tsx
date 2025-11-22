'use client'

import Link from 'next/link'
import { type ChangeEvent, type FormEvent, useState } from 'react'

export default function NewProjectPage() {
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
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Project data:', formData)
    alert('Project created successfully!')
  }

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

          <div className="flex gap-4">
            <Link
              href="/builder"
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-center font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Create Project
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
