import { useState, useEffect, useMemo, useRef } from 'react'
import { initWasm, getCalculator } from '@/lib/wasm-loader'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

interface InfoTooltipProps {
  text: string
}

function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <span className="relative inline-block group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline-block w-4 h-4 ml-1 text-indigo-500 cursor-help">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
      <span className="absolute z-50 w-64 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-gray-800"></div>
      </span>
    </span>
  )
}

interface Account {
  id: string
  type: 'RRSP' | 'TFSA'
  balance: number
  annualContribution: number
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [wasmLoaded, setWasmLoaded] = useState(false)
  const wasmInitialized = useRef(false)

  const [currentAge, setCurrentAge] = useState(35)
  const [retirementAge, setRetirementAge] = useState(65)
  const [expectedReturn, setExpectedReturn] = useState(7.0)
  const [inflationRate, setInflationRate] = useState(2.5)
  const [showRealValues, setShowRealValues] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', type: 'RRSP', balance: 100000, annualContribution: 0 },
    { id: '2', type: 'TFSA', balance: 80000, annualContribution: 0 },
  ])
  const [showAddMenu, setShowAddMenu] = useState(false)

  const ageError = retirementAge <= currentAge ? 'Retirement age must be greater than current age' : null

  const yearsToRetirement = retirementAge - currentAge
  const totalPortfolio = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  const currentYear = new Date().getFullYear()

  const projectionData = useMemo(() => {
    if (yearsToRetirement <= 0 || !wasmLoaded) return []

    try {
      const calculator = getCalculator()

      const totalRRSP = accounts.filter(a => a.type === 'RRSP').reduce((sum, acc) => sum + (acc.balance || 0), 0)
      const totalTFSA = accounts.filter(a => a.type === 'TFSA').reduce((sum, acc) => sum + (acc.balance || 0), 0)
      const totalRRSPContribution = accounts.filter(a => a.type === 'RRSP').reduce((sum, acc) => sum + (acc.annualContribution || 0), 0)
      const totalTFSAContribution = accounts.filter(a => a.type === 'TFSA').reduce((sum, acc) => sum + (acc.annualContribution || 0), 0)

      const householdConfig = {
        retirement_age: retirementAge,
        expected_annual_income: 0
      }
      const accountBalance = {
        rrsp: totalRRSP,
        tfsa: totalTFSA,
        resp: 0,
        non_registered: 0
      }
      const contributions = {
        rrsp_annual: totalRRSPContribution,
        tfsa_annual: totalTFSAContribution,
        resp_annual: 0,
        non_registered_annual: 0
      }
      const assumptions = {
        return_rate: expectedReturn,
        inflation_rate: inflationRate
      }

      const result = calculator.calculate_yearly_projections(
        householdConfig,
        accountBalance,
        contributions,
        assumptions,
        currentAge
      )

      return result.map((p: { year: number; age: number; rrsp: number; tfsa: number; resp: number; non_registered: number; total_net_worth: number }) => {
        const yearsFromNow = p.age - currentAge
        const inflationFactor = Math.pow(1 + inflationRate / 100, yearsFromNow)

      const rrspNominal = totalRRSP > 0 || totalRRSPContribution > 0 ? p.rrsp : undefined
      const tfsaNominal = totalTFSA > 0 || totalTFSAContribution > 0 ? p.tfsa : undefined

        const rrspReal = rrspNominal ? rrspNominal / inflationFactor : undefined
        const tfsaReal = tfsaNominal ? tfsaNominal / inflationFactor : undefined
        const totalNominal = p.total_net_worth
        const totalReal = totalNominal / inflationFactor

        return {
          year: p.year,
          age: p.age,
          RRSP: showRealValues ? rrspReal : rrspNominal,
          TFSA: showRealValues ? tfsaReal : tfsaNominal,
          Total: showRealValues ? totalReal : totalNominal,
        }
      })
    } catch (error) {
      console.error('Error calculating projection:', error)
      return []
    }
  }, [currentAge, retirementAge, expectedReturn, inflationRate, showRealValues, wasmLoaded, currentYear, yearsToRetirement, accounts])

  const portfolioAtRetirement = projectionData.length > 0
    ? projectionData[projectionData.length - 1].Total
    : 0

  useEffect(() => {
    if (wasmInitialized.current) return
    wasmInitialized.current = true

    initWasm().then(() => {
      setWasmLoaded(true)
    })
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if (isDarkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(isDarkMode))
  }, [isDarkMode])

  const addAccount = (type: 'RRSP' | 'TFSA') => {
    setAccounts([...accounts, { id: Date.now().toString(), type, balance: 0, annualContribution: 0 }])
    setShowAddMenu(false)
  }

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id))
  }

  const updateBalance = (id: string, balance: number) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, balance } : acc))
  }

  const updateAnnualContribution = (id: string, annualContribution: number) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, annualContribution } : acc))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div style={{ animation: 'fadeInUp 0.6s ease-out forwards', opacity: 0 }}>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Retirement Planning Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Plan your financial future with optimized investment strategies
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowRealValues(!showRealValues)}
              className="px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400"
            >
              {showRealValues ? 'Real (inflation-adjusted)' : 'Nominal'}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6" style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Age
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.valueAsNumber)}
                    className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    min={currentAge + 1}
                    max={100}
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.valueAsNumber)}
                    className={`w-full px-3 py-2 border-2 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm transition-all ${ageError
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                  />
                  {ageError && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                      {ageError}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group">
                  Expected Annual Return
                  <InfoTooltip text="Historical average stock market returns (e.g., S&P 500) over long periods" />
                </label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group">
                  Assumed Inflation Rate
                  <InfoTooltip text="Historical average inflation rate for purchasing power adjustments" />
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accounts
                </label>
                {accounts.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic py-2">No accounts added</p>
                ) : (
                  <div className="space-y-3">
                    {accounts.map((account) => (
                      <div key={account.id} className={`rounded-lg border p-3 account-${account.type.toLowerCase()}`}>
                        <div className="flex gap-2 items-center mb-2">
                          <span className="w-20 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wide rounded">
                            {account.type}
                          </span>
                          <button
                            onClick={() => deleteAccount(account.id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 rounded transition-colors"
                            title="Delete account"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Balance
                            </label>
                            <input
                              type="number"
                              min={0}
                              step={1000}
                              value={account.balance || ''}
                              onChange={(e) => updateBalance(account.id, e.target.valueAsNumber)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Annual Contribution
                            </label>
                            <input
                              type="number"
                              min={0}
                              step={100}
                              value={account.annualContribution || ''}
                              onChange={(e) => updateAnnualContribution(account.id, e.target.valueAsNumber)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="w-full px-4 py-2 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm font-medium transition-all"
                >
                  + Add Account
                </button>
                {showAddMenu && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <button
                      onClick={() => addAccount('RRSP')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                      RRSP
                    </button>
                    <button
                      onClick={() => addAccount('TFSA')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                      TFSA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6" style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Current Portfolio
              </h2>
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                ${totalPortfolio.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
              </div>
            </div>

            {yearsToRetirement > 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6" style={{ animation: 'fadeInUp 0.5s ease-out 0.15s forwards', opacity: 0 }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Portfolio at Retirement ({retirementAge})
                  </h2>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {showRealValues ? "In today's dollars" : "Nominal"}
                  </span>
                </div>
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${portfolioAtRetirement.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">
                    Growth: ${(portfolioAtRetirement - totalPortfolio).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({((portfolioAtRetirement / totalPortfolio - 1) * 100).toFixed(1)}%)
                  </div>
                  {projectionData.length > 0 && (
                    <div className="text-amber-600 dark:text-amber-400">
                      Total: ${(projectionData[projectionData.length - 1].Total ?? 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                  {projectionData.length > 0 && projectionData[projectionData.length - 1].RRSP !== undefined && (
                    <div className="text-indigo-600 dark:text-indigo-400">
                      RRSP: ${(projectionData[projectionData.length - 1].RRSP ?? 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                  {projectionData.length > 0 && projectionData[projectionData.length - 1].TFSA !== undefined && (
                    <div className="text-emerald-600 dark:text-emerald-400">
                      TFSA: ${(projectionData[projectionData.length - 1].TFSA ?? 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {yearsToRetirement > 0 && projectionData.length > 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6" style={{ animation: 'fadeInUp 0.5s ease-out 0.3s forwards', opacity: 0 }}>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Growth Projection
                </h2>
                <div className="mb-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">RRSP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">TFSA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-gray-700 dark:text-gray-300">Total</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke={isDarkMode ? '#374151' : '#e5e7eb'} strokeOpacity={0.5} />
                      <XAxis
                        dataKey="age"
                        stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                        tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#6b7280' }}
                        label={{ value: 'Age', position: 'insideBottom', offset: -5, fontSize: 13, fontWeight: 500, fill: isDarkMode ? '#f3f4f6' : '#6b7280' }}
                      />
                      <YAxis
                        stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                        tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: number | undefined, name?: string) => [`$${(value ?? 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, name || '']}
                        labelFormatter={(label) => `Age ${label}`}
                        labelStyle={{ color: isDarkMode ? '#f3f4f6' : '#374151', fontWeight: 500 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="RRSP"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={true}
                        activeDot={{ r: 8 }}
                        isAnimationActive={false}
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="TFSA"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={true}
                        activeDot={{ r: 8 }}
                        isAnimationActive={false}
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Total"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={true}
                        activeDot={{ r: 8 }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="mt-8 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            Built with Rust (WASM), React, and TypeScript
          </p>
          <a
            href="https://github.com/halfguru/retirement-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
