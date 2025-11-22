'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { type Building } from '@/app/projects/mockData'

import InvestModal from './InvestModal'

interface InvestButtonProps {
  project: Building
}

export default function InvestButton({ project }: InvestButtonProps) {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInvest = async (amount: number, tokens: number) => {
    console.log('Investing:', {
      amount,
      tokens,
      projectId: project.id,
      projectName: project.name,
    })

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // TODO: Integrate with Smart Contract
    // Example:
    // const { writeContract, waitForTransaction } = useWriteContract()
    // const hash = await writeContract({
    //   address: CONTRACT_ADDRESS,
    //   abi: CONTRACT_ABI,
    //   functionName: 'invest',
    //   args: [project.id, tokens],
    //   value: parseEther(amount.toString()),
    // })
    // await waitForTransaction({ hash })
  }

  if (!isConnected) {
    return (
      <button
        onClick={openConnectModal}
        className="w-full rounded-lg bg-black py-4 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full rounded-lg bg-black py-4 font-semibold text-white transition-all duration-300 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Invest Now
      </button>
      <InvestModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvest={handleInvest}
      />
    </>
  )
}
