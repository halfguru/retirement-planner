import type { ProjectionDataPoint } from '@/hooks/useProjection'
import { getCalculator } from '@/lib/wasm-loader'

interface GoalsCardProps {
  currentProjectionData: ProjectionDataPoint[]
  annualIncome: number
  annualPension: number
  replacementRate: number
  withdrawalRate: number
  yearsToRetirement: number
  expectedReturn: number
  inflationRate: number
  currentAnnualContributions: number
  currentPortfolio: number
}

export function GoalsCard({
  currentProjectionData,
  annualIncome,
  annualPension,
  replacementRate,
  withdrawalRate,
  yearsToRetirement,
  expectedReturn,
  inflationRate,
  currentAnnualContributions,
  currentPortfolio
}: GoalsCardProps) {
  const portfolioAtRetirement = currentProjectionData.length > 0
    ? currentProjectionData[currentProjectionData.length - 1].Total
    : 0

  const requiredAnnualIncome = annualIncome * (replacementRate / 100)
  const requiredAnnualIncomeAfterPension = Math.max(0, requiredAnnualIncome - annualPension)
  const requiredPortfolio = withdrawalRate > 0 ? requiredAnnualIncomeAfterPension / (withdrawalRate / 100) : 0
  const progress = requiredPortfolio > 0 ? Math.min(100, (portfolioAtRetirement / requiredPortfolio) * 100) : 0
  const gap = requiredPortfolio - portfolioAtRetirement

  const calculateAdditionalAnnualSavings = (): number => {
    const initialPortfolio = currentProjectionData.length > 0 ? currentProjectionData[0].Total : currentPortfolio
    try {
      const calculator = getCalculator()
      return calculator.calculate_additional_annual_savings(
        initialPortfolio,
        requiredPortfolio,
        yearsToRetirement,
        expectedReturn,
        inflationRate,
        currentAnnualContributions
      )
    } catch (error) {
      console.warn('WASM not initialized yet, using fallback calculation:', error)
      const monthlyNominalRate = expectedReturn / 100 / 12
      const monthlyInflationRate = inflationRate / 100 / 12
      const months = yearsToRetirement * 12
      const monthlyRealRate = monthlyNominalRate - monthlyInflationRate
      if (monthlyRealRate <= 0) return gap / yearsToRetirement
      const monthlyRealSavings = gap * monthlyRealRate / ((1 + monthlyRealRate) ** months - 1)
      return monthlyRealSavings * 12
    }
  }

  const additionalAnnualSavings = calculateAdditionalAnnualSavings()

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6" style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        🏁 Retirement Goal Progress
      </h2>

      <div className="space-y-4">
        {annualPension > 0 && (
          <div className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex justify-between items-center">
              <span>💰 Annual Pension Income</span>
              <span className="font-semibold">${annualPension.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year</span>
            </div>
            <div className="text-xs mt-1 text-emerald-700 dark:text-emerald-300">
              After pension, need: ${requiredAnnualIncomeAfterPension.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year from portfolio
            </div>
          </div>
        )}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Goal: ${requiredAnnualIncome.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year</span>
            <span className="text-gray-600 dark:text-gray-400">Needs: ${requiredPortfolio.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-emerald-500' : progress >= 75 ? 'bg-blue-500' : progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="text-right text-sm mt-1 font-medium">
            {progress >= 100 ? '🎉 Goal achieved!' : `${progress.toFixed(1)}%`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Projection</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${portfolioAtRetirement.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gap to Goal</div>
            <div className={`text-lg font-semibold ${gap > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ${gap.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {gap > 0 && yearsToRetirement > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-lg border border-amber-200 dark:border-amber-800">
            💰 To reach your goal, save an additional{' '}
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              ${additionalAnnualSavings.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>{' '}
            per year across all accounts.
          </div>
        )}
      </div>
    </div>
  )
}
