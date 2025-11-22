import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/providers/WagmiProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "BrickByBrick",
  description: "BrickByBrick is coming soon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Providers>
            <Header />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
