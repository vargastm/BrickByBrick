'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured.')
}

export const config = getDefaultConfig({
  appName: 'BrickByBrick',
  projectId,
  chains: [sepolia],
  ssr: false,
})
