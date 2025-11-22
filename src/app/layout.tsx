import './globals.css'

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
          </WagmiProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
