import type { ProjectionDataPoint } from '@/hooks/useProjection'

interface RetirementProjectionCardProps {
  portfolioView: 'combined' | 'individual'
  currentProjectionData: ProjectionDataPoint[]
  totalPortfolio: number
  selectedPersonPortfolio: number
  yearsToRetirement: number
}

export function RetirementProjectionCard({
  portfolioView,
  currentProjectionData,
  totalPortfolio,
  selectedPersonPortfolio,
  yearsToRetirement
}: RetirementProjectionCardProps) {
  if (yearsToRetirement <= 0) return null

  const portfolioAtRetirement = currentProjectionData.length > 0
    ? currentProjectionData[currentProjectionData.length - 1].Total
    : 0

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6" style={{ animation: 'fadeInUp 0.5s ease-out 0.15s forwards', opacity: 0 }}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        🎓 Portfolio at Retirement
      </h2>
      <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
        ${portfolioAtRetirement.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="text-gray-500 dark:text-gray-400">
          Growth: ${((portfolioAtRetirement - (portfolioView === 'combined' ? totalPortfolio : selectedPersonPortfolio))).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({((portfolioAtRetirement / (portfolioView === 'combined' ? totalPortfolio : selectedPersonPortfolio) - 1) * 100).toFixed(1)}%)
        </div>
        {currentProjectionData.length > 0 && (
          <div className="text-amber-600 dark:text-amber-400">
            Total: ${(currentProjectionData[currentProjectionData.length - 1].Total ?? 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        )}
        {currentProjectionData.length > 0 && currentProjectionData[currentProjectionData.length - 1].RRSP !== undefined && (
          <div className="text-indigo-600 dark:text-indigo-400">
            RRSP: ${(currentProjectionData[currentProjectionData.length - 1].RRSP ?? 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        )}
        {currentProjectionData.length > 0 && currentProjectionData[currentProjectionData.length - 1].TFSA !== undefined && (
          <div className="text-emerald-600 dark:text-emerald-400">
            TFSA: ${(currentProjectionData[currentProjectionData.length - 1].TFSA ?? 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        )}
      </div>
    </div>
  )
}
