import './globals.css'

import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import React from 'react'

import Footer from '@/components/Footer'
import HeaderWrapper from '@/components/HeaderWrapper'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { WagmiProviderWrapper } from '@/providers/WagmiProviderWrapper'

export const metadata: Metadata = {
  title: 'BrickByBrick',
  description: 'BrickByBrick is coming soon',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <WagmiProviderWrapper>
            <HeaderWrapper />
            {children}
            <Footer />
            <SpeedInsights />
          </WagmiProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
