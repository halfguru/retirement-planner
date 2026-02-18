import { useMemo, useState, useEffect, useCallback } from 'react'
import './App.css'
import { useDarkMode } from '@/hooks/useDarkMode'
import { usePeopleManagement } from '@/hooks/usePeopleManagement'
import { useProjection } from '@/hooks/useProjection'
import { AssumptionsPanel } from '@/components/dashboard/AssumptionsPanel'
import { PersonSelector } from '@/components/dashboard/PersonSelector'
import { PersonForm } from '@/components/dashboard/PersonForm'
import { PortfolioCard } from '@/components/dashboard/PortfolioCard'
import { RetirementProjectionCard } from '@/components/dashboard/RetirementProjectionCard'
import { GrowthChart } from '@/components/dashboard/GrowthChart'
import { GoalsCard } from '@/components/dashboard/GoalsCard'
import { ViewSelector } from '@/components/dashboard/ViewSelector'
import { exportToYAML, downloadYAML, uploadYAML } from '@/lib/yaml-utils'

function App() {
  const [isDarkMode, setIsDarkMode] = useDarkMode()
  
  const [showRealValues, setShowRealValues] = useState(() => {
    const saved = localStorage.getItem('showRealValues')
    return saved !== null ? saved === 'true' : true
  })
  
  const [expectedReturn, setExpectedReturn] = useState(() => {
    const saved = localStorage.getItem('expectedReturn')
    return saved !== null ? parseFloat(saved) : 7.0
  })
  
  const [inflationRate, setInflationRate] = useState(() => {
    const saved = localStorage.getItem('inflationRate')
    return saved !== null ? parseFloat(saved) : 2.5
  })

  const [replacementRate, setReplacementRate] = useState(() => {
    const saved = localStorage.getItem('replacementRate')
    return saved !== null ? parseFloat(saved) : 70
  })

  const [withdrawalRate, setWithdrawalRate] = useState(() => {
    const saved = localStorage.getItem('withdrawalRate')
    return saved !== null ? parseFloat(saved) : 4.0
  })

  const [portfolioView, setPortfolioView] = useState<'combined' | 'individual'>('combined')
  const [portfolioPersonId, setPortfolioPersonId] = useState<string | null>(() => {
    const saved = localStorage.getItem('people')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed[0]?.id || null
      } catch {
        return '1'
      }
    }
    return '1'
  })

  const {
    people,
    setPeople,
    selectedPersonId,
    setSelectedPersonId,
    addPerson,
    deletePerson,
    updatePerson,
    updatePersonAnnualIncome,
    updatePersonAnnualPension,
    addAccount,
    deleteAccount,
    updateAccountBalance,
    updateAccountContribution
  } = usePeopleManagement()

  const { calculateProjection } = useProjection()

  const saveToLocalStorage = useCallback(() => {
    people.forEach((person, idx) => {
      localStorage.setItem(`person_${idx}_currentAge`, String(person.currentAge))
      localStorage.setItem(`person_${idx}_retirementAge`, String(person.retirementAge))
      localStorage.setItem(`person_${idx}_annualPension`, String(person.annualPension || 0))
      person.accounts.forEach((account) => {
        localStorage.setItem(`account_${account.id}_balance`, String(account.balance))
        localStorage.setItem(`account_${account.id}_annualContribution`, String(account.annualContribution))
      })
    })
    localStorage.setItem('people', JSON.stringify(people))
    localStorage.setItem('expectedReturn', String(expectedReturn))
    localStorage.setItem('inflationRate', String(inflationRate))
    localStorage.setItem('showRealValues', String(showRealValues))
    localStorage.setItem('replacementRate', String(replacementRate))
    localStorage.setItem('withdrawalRate', String(withdrawalRate))
  }, [people, expectedReturn, inflationRate, showRealValues, replacementRate, withdrawalRate])

  useEffect(() => {
    saveToLocalStorage()
  }, [saveToLocalStorage])

  const effectivePortfolioPersonId = useMemo(() => {
    if (people.length === 0) return null
    const isValid = people.some(p => p.id === portfolioPersonId)
    return isValid ? portfolioPersonId : people[0].id
  }, [people, portfolioPersonId])

  const householdRetirementAge = Math.max(...people.map(p => p.retirementAge))
  const yearsToRetirement = householdRetirementAge - Math.min(...people.map(p => p.currentAge))
  const totalAnnualIncome = people.reduce((sum, p) => sum + (p.annualIncome || 0), 0)
  const totalAnnualPension = people.reduce((sum, p) => sum + (p.annualPension || 0), 0)
  const allAccounts = people.flatMap(p => p.accounts)
  const totalPortfolio = allAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  const totalAnnualContributions = allAccounts.reduce((sum, acc) => sum + (acc.annualContribution || 0), 0)
  const selectedPortfolioPerson = people.find(p => p.id === effectivePortfolioPersonId) || people[0]
  const selectedPersonAccounts = useMemo(() => selectedPortfolioPerson?.accounts || [], [selectedPortfolioPerson])
  const selectedPersonPortfolio = useMemo(() => selectedPersonAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0), [selectedPersonAccounts])

  const projectionData = useMemo(() => {
    const youngestAge = Math.min(...people.map(p => p.currentAge))
    return calculateProjection(allAccounts, householdRetirementAge, youngestAge, expectedReturn, inflationRate, showRealValues, yearsToRetirement)
  }, [allAccounts, householdRetirementAge, expectedReturn, inflationRate, showRealValues, calculateProjection, yearsToRetirement, people])

  const individualProjectionData = useMemo(() => {
    if (!selectedPortfolioPerson) return []
    const baseAge = selectedPortfolioPerson.currentAge
    return calculateProjection(selectedPersonAccounts, selectedPortfolioPerson.retirementAge, baseAge, expectedReturn, inflationRate, showRealValues, yearsToRetirement)
  }, [selectedPortfolioPerson, selectedPersonAccounts, expectedReturn, inflationRate, showRealValues, calculateProjection, yearsToRetirement])

  const currentProjectionData = portfolioView === 'combined' ? projectionData : individualProjectionData

  const realProjectionData = useMemo(() => {
    if (portfolioView === 'combined') {
      const youngestAge = Math.min(...people.map(p => p.currentAge))
      return calculateProjection(allAccounts, householdRetirementAge, youngestAge, expectedReturn, inflationRate, true, yearsToRetirement)
    } else if (selectedPortfolioPerson) {
      const baseAge = selectedPortfolioPerson.currentAge
      return calculateProjection(selectedPersonAccounts, selectedPortfolioPerson.retirementAge, baseAge, expectedReturn, inflationRate, true, yearsToRetirement)
    }
    return []
  }, [allAccounts, householdRetirementAge, expectedReturn, inflationRate, calculateProjection, yearsToRetirement, people, portfolioView, selectedPortfolioPerson, selectedPersonAccounts])

  const handleExport = () => {
    const yamlContent = exportToYAML(
      {
        expectedReturn,
        inflationRate,
        replacementRate,
        withdrawalRate,
        showRealValues
      },
      people
    )
    const date = new Date().toISOString().split('T')[0]
    downloadYAML(yamlContent, `retirement-plan-${date}.yaml`)
  }

  const handleImport = async () => {
    const plan = await uploadYAML()
    if (!plan) return

    setExpectedReturn(plan.assumptions.expectedReturn)
    setInflationRate(plan.assumptions.inflationRate)
    setReplacementRate(plan.assumptions.replacementRate)
    setWithdrawalRate(plan.assumptions.withdrawalRate)
    setShowRealValues(plan.assumptions.showRealValues)

    setPeople(plan.people)
    if (plan.people.length > 0) {
      setSelectedPersonId(plan.people[0].id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div className="text-left" style={{ animation: 'fadeInUp 0.6s ease-out forwards', opacity: 0 }}>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Retire, Eh? 🍁
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Plan your retirement, eh?
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleExport}
              className="px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400"
              title="Export plan to YAML"
            >
              ⬇️ Export
            </button>
            <button
              onClick={handleImport}
              className="px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400"
              title="Import plan from YAML"
            >
              ⬆️ Import
            </button>
            <div className="relative inline-block group">
              <button
                onClick={() => setShowRealValues(!showRealValues)}
                className="px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400"
              >
                {showRealValues ? 'Today\'s dollars' : 'Future dollars'}
              </button>
              <span className="absolute z-50 w-72 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none">
                {showRealValues
                  ? 'Values shown in today\'s purchasing power, adjusted for inflation.'
                  : 'Future dollar amounts without inflation adjustment.'
                }
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-800"></div>
              </span>
            </div>
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
          <div className="lg:col-span-1 space-y-6">
            <button
              onClick={addPerson}
              className="w-full px-4 py-3 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-sm font-medium transition-all"
            >
              ➕ Add Person
            </button>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6 relative z-10" style={{ animation: 'fadeInUp 0.5s ease-out forwards', opacity: 0 }}>
              <PersonSelector
                people={people}
                selectedPersonId={selectedPersonId}
                onSelect={setSelectedPersonId}
              />
              <PersonForm
                people={people}
                selectedPersonId={selectedPersonId}
                onSelect={setSelectedPersonId}
                onUpdatePerson={updatePerson}
                onUpdatePersonAnnualIncome={updatePersonAnnualIncome}
                onUpdatePersonAnnualPension={updatePersonAnnualPension}
                onDeletePerson={deletePerson}
                onAddAccount={addAccount}
                onDeleteAccount={deleteAccount}
                onUpdateAccountBalance={updateAccountBalance}
                onUpdateAccountContribution={updateAccountContribution}
              />
            </div>

            <AssumptionsPanel
              expectedReturn={expectedReturn}
              setExpectedReturn={setExpectedReturn}
              inflationRate={inflationRate}
              setInflationRate={setInflationRate}
              replacementRate={replacementRate}
              setReplacementRate={setReplacementRate}
              withdrawalRate={withdrawalRate}
              setWithdrawalRate={setWithdrawalRate}
            />

            {people.length === 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No people added yet. Click the button above to add someone.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ViewSelector
              portfolioView={portfolioView}
              onViewChange={setPortfolioView}
              selectedPortfolioPersonId={portfolioPersonId}
              people={people}
              onPersonChange={setPortfolioPersonId}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PortfolioCard
                portfolioView={portfolioView}
                totalPortfolio={totalPortfolio}
                selectedPersonPortfolio={selectedPersonPortfolio}
                allAccounts={allAccounts}
                selectedPersonAccounts={selectedPersonAccounts}
                selectedPortfolioPerson={selectedPortfolioPerson}
              />

              <RetirementProjectionCard
                portfolioView={portfolioView}
                currentProjectionData={currentProjectionData}
                totalPortfolio={totalPortfolio}
                selectedPersonPortfolio={selectedPersonPortfolio}
                yearsToRetirement={yearsToRetirement}
              />
            </div>

            <GoalsCard
              currentProjectionData={realProjectionData}
              annualIncome={totalAnnualIncome}
              annualPension={totalAnnualPension}
              replacementRate={replacementRate}
              withdrawalRate={withdrawalRate}
              yearsToRetirement={yearsToRetirement}
              expectedReturn={expectedReturn}
              inflationRate={inflationRate}
              currentAnnualContributions={totalAnnualContributions}
              currentPortfolio={totalPortfolio}
            />

            <GrowthChart
              isDarkMode={isDarkMode}
              portfolioView={portfolioView}
              selectedPortfolioPerson={selectedPortfolioPerson}
              currentProjectionData={currentProjectionData}
              yearsToRetirement={yearsToRetirement}
            />
          </div>
        </div>
      </div>
      <footer className="mt-8 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            Built with Rust (WASM), React, and TypeScript 🍁
          </p>
          <a
            href="https://github.com/halfguru/retire-eh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            GitHub Repository
          </a>
        </div>
      </footer>
    </div >
  )
}

export default App
