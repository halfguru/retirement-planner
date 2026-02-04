import { useEffect, useRef, useState } from 'react'
import { initWasm, getCalculator } from '@/lib/wasm-loader'
import type { HouseholdConfig, AccountBalance, ContributionConfig, ChildInfo, Assumptions, RetirementProjection } from '@/types/household'
import './App.css'

function App() {
  const [wasmLoaded, setWasmLoaded] = useState(false)
  const wasmInitialized = useRef(false)
  const householdConfig: HouseholdConfig = {
    retirement_age: 65,
    expected_annual_income: 60000,
  }

  const currentAge = 35

  const accountBalance: AccountBalance = {
    rrsp: 100000,
    tfsa: 80000,
    resp: 30000,
    non_registered: 50000,
  }

  const contributions: ContributionConfig = {
    rrsp_annual: 12000,
    tfsa_annual: 6000,
    resp_annual: 2500,
    non_registered_annual: 3000,
  }

  const children: ChildInfo[] = [
    { age: 8, target_contribution: 2500 },
  ]

  const assumptions: Assumptions = {
    return_rate: 5.0,
    inflation_rate: 2.0,
  }

  const [projection, setProjection] = useState<RetirementProjection | null>(null)

  useEffect(() => {
    if (wasmInitialized.current) return
    wasmInitialized.current = true

    initWasm().then(() => {
      setWasmLoaded(true)

      const calculator = getCalculator()

      const projResult = calculator.calculate_projection(
        householdConfig,
        accountBalance,
        contributions,
        children,
        assumptions,
        currentAge,
      )

      setProjection(projResult)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!wasmLoaded) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">
          Retirement Planning Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-neutral-700 mb-4">
              Inputs
            </h2>
            <p className="text-neutral-500">Configuration panel coming soon...</p>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-neutral-700 mb-4">
                Pension Equivalent
              </h2>
              {projection && (
                <div className="text-2xl font-bold text-neutral-800">
                  ${projection.pension_equivalent.toFixed(0)}/year indexed pension
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-neutral-700 mb-4">
                Net Worth Projection
              </h2>
              <p className="text-neutral-500">Chart coming soon...</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-neutral-700 mb-4">
                Retirement Income
              </h2>
              <p className="text-neutral-500">Chart coming soon...</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-neutral-700 mb-4">
                Account Breakdown
              </h2>
              <p className="text-neutral-500">Chart coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
