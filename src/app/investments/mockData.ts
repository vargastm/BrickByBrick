import { type Building, buildings, getPexelsImage } from '../projects/mockData'

export interface Investment {
  id: number
  projectId: number
  amountInvested: string
  tokensOwned: string
  currentValue: string
  returnPercentage: number
  investmentDate: string
  project: Building
}

export const investments: Investment[] = [
  {
    id: 1,
    projectId: 1,
    amountInvested: '125,000',
    tokensOwned: '500,000',
    currentValue: '145,000',
    returnPercentage: 16.0,
    investmentDate: '2025-01-15',
    project: buildings[0],
  },
  {
    id: 2,
    projectId: 3,
    amountInvested: '85,000',
    tokensOwned: '300,000',
    currentValue: '98,000',
    returnPercentage: 15.3,
    investmentDate: '2025-02-20',
    project: buildings[2],
  },
  {
    id: 3,
    projectId: 5,
    amountInvested: '200,000',
    tokensOwned: '1,200,000',
    currentValue: '234,000',
    returnPercentage: 17.0,
    investmentDate: '2025-03-10',
    project: buildings[4],
  },
  {
    id: 4,
    projectId: 6,
    amountInvested: '150,000',
    tokensOwned: '400,000',
    currentValue: '162,000',
    returnPercentage: 8.0,
    investmentDate: '2025-04-05',
    project: buildings[5],
  },
]

export const getTotalInvested = () => {
  return investments.reduce(
    (sum, inv) => sum + parseFloat(inv.amountInvested.replace(/,/g, '')),
    0,
  )
}

export const getTotalCurrentValue = () => {
  return investments.reduce(
    (sum, inv) => sum + parseFloat(inv.currentValue.replace(/,/g, '')),
    0,
  )
}

export const getTotalReturn = () => {
  const invested = getTotalInvested()
  const current = getTotalCurrentValue()
  return ((current - invested) / invested) * 100
}

export interface PortfolioDataPoint {
  date: string
  value: number
  invested: number
}

export const getPortfolioHistory = (): PortfolioDataPoint[] => {
  const startDate = new Date('2025-01-01')
  const data: PortfolioDataPoint[] = []
  let cumulativeInvested = 0
  let cumulativeValue = 0

  const sortedInvestments = [...investments].sort(
    (a, b) =>
      new Date(a.investmentDate).getTime() -
      new Date(b.investmentDate).getTime(),
  )

  for (let month = 0; month <= 6; month++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + month)
    const dateStr = date.toISOString().split('T')[0]

    sortedInvestments.forEach((inv) => {
      if (new Date(inv.investmentDate) <= date) {
        const investedAmount = parseFloat(inv.amountInvested.replace(/,/g, ''))

        const monthsSinceInvestment =
          (date.getTime() - new Date(inv.investmentDate).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
        const growthFactor =
          1 + ((inv.returnPercentage / 100) * monthsSinceInvestment) / 6
        const adjustedValue = investedAmount * growthFactor

        cumulativeInvested += investedAmount
        cumulativeValue += adjustedValue
      }
    })

    data.push({
      date: dateStr,
      value: cumulativeValue,
      invested: cumulativeInvested,
    })
  }

  return data
}

export { getPexelsImage }
