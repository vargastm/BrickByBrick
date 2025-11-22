'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Providers = dynamic(
  () => import('./WagmiProvider').then((mod) => ({ default: mod.Providers })),
  { ssr: false },
)

export function WagmiProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
