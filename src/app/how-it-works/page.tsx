'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'Discover Projects',
    shortTitle: 'Discover Projects',
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
    shortTitle: 'Connect Wallet',
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
    shortTitle: 'AI Valuation',
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
    shortTitle: 'Invest in Tokens',
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
    shortTitle: 'Track Milestones',
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
    shortTitle: 'Earn Returns',
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

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const updateActiveStep = () => {
      const viewportTop = window.scrollY + 200
      const viewportCenter = window.scrollY + window.innerHeight / 2

      let activeIndex = 0
      let minDistance = Infinity

      stepRefs.current.forEach((ref, index) => {
        if (!ref) return

        const rect = ref.getBoundingClientRect()
        const elementTop = window.scrollY + rect.top
        const elementCenter = elementTop + rect.height / 2

        const distance = Math.abs(elementCenter - viewportCenter)

        if (
          elementTop < viewportTop + window.innerHeight &&
          elementTop + rect.height > viewportTop &&
          distance < minDistance
        ) {
          minDistance = distance
          activeIndex = index
        }
      })

      setActiveStep(activeIndex)
    }

    window.addEventListener('scroll', updateActiveStep, { passive: true })
    updateActiveStep()

    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const rect = entry.boundingClientRect
            const viewportCenter = window.innerHeight / 2
            const elementCenter = rect.top + rect.height / 2

            if (
              Math.abs(elementCenter - viewportCenter) <
              window.innerHeight * 0.4
            ) {
              setActiveStep(index)
            }
          }
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '-100px 0px -100px 0px',
        },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      window.removeEventListener('scroll', updateActiveStep)
      observers.forEach((observer) => {
        if (observer) {
          observer.disconnect()
        }
      })
    }
  }, [])

  const scrollToStep = (index: number) => {
    stepRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-[#0f101a] dark:via-zinc-950 dark:to-[#0f101a]">
      <section className="relative mt-16 flex min-h-[600px] items-center justify-center overflow-hidden border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-900 to-black py-20 dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative container mx-auto max-w-7xl px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              How ByB Works
            </h1>
            <p className="mb-8 text-xl text-zinc-300 md:text-2xl">
              Learn how to invest in tokenized construction projects with
              blockchain-powered transparency
            </p>
            <div className="flex justify-center">
              <Link
                href="/demo"
                className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-zinc-200"
              >
                Watch the Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-zinc-200 bg-white/80 backdrop-blur-sm lg:block dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="p-6">
            <h2 className="mb-6 text-sm font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              Steps
            </h2>
            <nav className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => scrollToStep(index)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${
                    activeStep === index
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      activeStep === index
                        ? 'text-white dark:text-black'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="text-sm font-medium">{step.shortTitle}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <section className="container mx-auto max-w-4xl px-4 py-20">
            <div className="space-y-32">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    stepRefs.current[index] = el
                  }}
                  className="scroll-mt-20"
                >
                  <StepContent step={step} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
              Your questions, answered
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <FAQAccordion />
          </div>
        </div>
      </section>

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

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
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
  ]

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {faqs.map((faq, index) => (
        <div key={index}>
          <button
            onClick={() => toggleItem(index)}
            className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            <span className="text-lg font-medium text-zinc-900 dark:text-white">
              {faq.question}
            </span>
            <svg
              className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 dark:text-zinc-400 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
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
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pb-6 text-zinc-600 dark:text-zinc-400">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StepContent({ step }: { step: (typeof steps)[0] }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        <div className="flex flex-1 flex-col gap-6">
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

        <div className="flex flex-1 items-center justify-center">
          <div
            className={`flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white text-black transition-all delay-300 duration-1000 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${
              isVisible
                ? 'scale-100 rotate-0 opacity-100'
                : 'scale-75 rotate-12 opacity-0'
            }`}
          >
            {step.icon}
          </div>
        </div>
      </div>
    </div>
  )
}
