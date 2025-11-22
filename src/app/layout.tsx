import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Providers } from '@/providers/WagmiProvider'

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
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
