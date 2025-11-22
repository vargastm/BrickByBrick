import Link from 'next/link'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Discover Projects',
      description:
        'Browse through our curated selection of tokenized construction projects. Each project includes detailed information about location, valuation, progress, and investment opportunities.',
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Connect Your Wallet',
      description:
        'Securely connect your Web3 wallet using WalletConnect. Our platform supports all major wallets including MetaMask, Coinbase Wallet, and Rainbow.',
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Review AI Valuation',
      description:
        'Get instant, AI-powered property valuations based on market data, location analysis, and construction progress. Make informed investment decisions with transparent insights.',
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Invest in Tokens',
      description:
        'Purchase project tokens representing your share of the property. Each token is backed by real assets and tracked on the blockchain for complete transparency.',
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      number: '05',
      title: 'Track Milestones',
      description:
        'Monitor construction progress in real-time through onchain milestones. Each milestone completion is verified on the blockchain, ensuring transparency and accountability.',
      icon: (
        <svg
          className="h-8 w-8"
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
      ),
    },
    {
      number: '06',
      title: 'Earn Returns',
      description:
        'As the project progresses and the property value increases, your tokens appreciate in value. Sell your tokens anytime or hold for long-term returns.',
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ]

  const features = [
    {
      title: 'Blockchain Transparency',
      description:
        'Every transaction and milestone is recorded on-chain, providing immutable proof of progress and ownership.',
    },
    {
      title: 'AI-Powered Insights',
      description:
        'Leverage advanced AI algorithms to get accurate property valuations and market predictions.',
    },
    {
      title: 'Real-time Updates',
      description:
        'Receive instant notifications about project milestones, progress updates, and market changes.',
    },
    {
      title: 'Liquidity Options',
      description:
        'Buy and sell tokens anytime through our marketplace, providing flexibility for your investment strategy.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      {/* Hero Section */}
      <section className="relative mt-16 flex min-h-[400px] items-center justify-center overflow-hidden border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              How It Works
            </h1>
            <p className="mb-8 text-xl text-zinc-300 md:text-2xl">
              Learn how to invest in tokenized construction projects with
              blockchain-powered transparency
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            Simple 6-Step Process
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            From discovery to returns, investing has never been easier
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12"
            >
              <div
                className={`flex flex-1 flex-col gap-6 ${
                  index % 2 === 1 ? 'md:order-2' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-4xl font-bold text-white dark:bg-white dark:text-black">
                    {step.number}
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </p>
              </div>

              <div
                className={`flex flex-1 items-center justify-center ${
                  index % 2 === 1 ? 'md:order-1' : ''
                }`}
              >
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
                  {step.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
              Why Choose BrickByBrick?
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Built on cutting-edge technology for transparent, secure investing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {[
            {
              question: 'What is tokenized real estate?',
              answer:
                'Tokenized real estate represents property ownership through blockchain tokens. Each token represents a fractional share of the property, allowing you to invest in real estate with lower barriers to entry.',
            },
            {
              question: 'How are milestones verified?',
              answer:
                'Milestones are verified on-chain through smart contracts. Construction progress is documented and verified by independent auditors before being recorded on the blockchain.',
            },
            {
              question: 'Can I sell my tokens anytime?',
              answer:
                'Yes! Your tokens are fully liquid. You can buy or sell them anytime through our marketplace, providing flexibility for your investment strategy.',
            },
            {
              question: 'What wallets are supported?',
              answer:
                'We support all major Web3 wallets including MetaMask, Coinbase Wallet, Rainbow, and WalletConnect-compatible wallets.',
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="mb-3 text-lg font-bold text-zinc-900 dark:text-white">
                {faq.question}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-xl text-zinc-300">
              Join thousands of investors building the future, brick by brick
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/projects"
                className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-zinc-200"
              >
                Browse Projects
              </Link>
              <Link
                href="/builder"
                className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                List Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
