import { InfoTooltip } from './InfoTooltip'

interface AssumptionsPanelProps {
  expectedReturn: number
  setExpectedReturn: (value: number) => void
  inflationRate: number
  setInflationRate: (value: number) => void
  replacementRate: number
  setReplacementRate: (value: number) => void
  withdrawalRate: number
  setWithdrawalRate: (value: number) => void
}

export function AssumptionsPanel({
  expectedReturn,
  setExpectedReturn,
  inflationRate,
  setInflationRate,
  replacementRate,
  setReplacementRate,
  withdrawalRate,
  setWithdrawalRate
}: AssumptionsPanelProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6 relative z-10" style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        ⚙️ Assumptions
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
              <span className="flex-1">
                Expected Annual Return
              </span>
              <InfoTooltip text="Historical average stock market returns (e.g., S&P 500) over long periods" />
            </div>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.valueAsNumber)}
                className="w-full px-3 py-2 pr-8 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
              <span className="flex-1">
                Assumed Inflation Rate
              </span>
              <InfoTooltip text="Historical average inflation rate for purchasing power adjustments" />
            </div>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.valueAsNumber)}
                className="w-full px-3 py-2 pr-8 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
              <span className="flex-1">
                Income Goal (%)
              </span>
              <InfoTooltip text="Percentage of pre-retirement income needed in retirement (70% is common)" />
            </div>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={150}
                step={5}
                value={replacementRate}
                onChange={(e) => setReplacementRate(e.target.valueAsNumber)}
                className="w-full px-3 py-2 pr-8 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
              <span className="flex-1">
                Withdrawal Rate
              </span>
              <InfoTooltip text="Percentage you can safely withdraw annually (4% rule is common)" />
            </div>
            <div className="relative">
              <input
                type="number"
                min={0.1}
                max={10}
                step={0.1}
                value={withdrawalRate}
                onChange={(e) => setWithdrawalRate(e.target.valueAsNumber)}
                className="w-full px-3 py-2 pr-8 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
