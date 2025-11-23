# BrickByBrick AI Coding Instructions

## 1. Project Context & Architecture
- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5.
- **Styling**: Tailwind CSS 4 with dark mode support (`dark:` classes).
- **Web3 Stack**: Wagmi v2, Viem, RainbowKit, and **MultiBaas SDK**.
- **Core Logic**: Tokenized real estate platform with "Builder" (project creation) and "Investor" (funding) flows.
- **Blockchain Pattern**: Hybrid approach using **MultiBaas SDK** to construct transactions and **Wagmi** to sign/broadcast them from the user's wallet.

## 2. Critical Developer Workflows
- **Development**: Run `npm run dev` to start the server on `localhost:3000`.
- **Linting**: Use `npm run lint:fix` to auto-fix style issues before committing.
- **Environment**: Requires `.env.local` with `NEXT_PUBLIC_MULTIBAAS_*` and `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` keys.
- **Mock Data**: Use `src/app/projects/mockData.ts` for UI development when contracts aren't ready.

## 3. Code Patterns & Conventions

### Blockchain Interactions (Crucial)
Do NOT use raw `ethers.js` or standard `wagmi` write hooks alone for complex contract calls. Follow this pattern (see `src/app/builder/new/page.tsx`):
1.  **Configure MultiBaas**: Initialize `ContractsApi` with host/key.
2.  **Construct Transaction**: Use `contractsApi.callContractFunction(...)` to generate the transaction payload.
3.  **Sign & Send**: Extract `to`, `data`, `value` from the MultiBaas response and use Wagmi's `sendTransaction` to execute it on-chain.
4.  **Wait**: Use `useWaitForTransactionReceipt` to track confirmation.

### Component Structure
- **Client Components**: Mark interactive components (using hooks) with `'use client'` at the top.
- **Forms**: Use controlled inputs with `useState` for form data (e.g., `NewProjectPage`).
- **UI Feedback**: Always implement loading states (`isSubmitting`, `isPendingTransaction`) and error handling (`try/catch` setting an `error` state).

### Styling
- Use Tailwind utility classes exclusively.
- Support dark mode in all components (e.g., `bg-white dark:bg-zinc-900`).
- Use `zinc` colors for grayscales to match the existing theme.

## 4. Key Files & Directories
- `src/app/config.ts`: Wagmi/RainbowKit configuration (Chain setup).
- `src/providers/WagmiProvider.tsx`: Wraps the app with Web3 context.
- `src/app/builder/new/page.tsx`: **Reference implementation** for the MultiBaas + Wagmi pattern.
- `src/app/api/validate/route.ts`: Example of Next.js API route proxying external services.
