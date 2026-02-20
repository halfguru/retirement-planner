import { AssumptionsPanel } from './AssumptionsPanel'
import { PersonSelector } from './PersonSelector'
import { PersonForm } from './PersonForm'
import type { Person } from '@/hooks/usePeopleManagement'

interface PlanTabProps {
  people: Person[]
  selectedPersonId: string | null
  onSelectPerson: (id: string) => void
  onUpdatePerson: (id: string, field: keyof Person, value: string | number) => void
  onUpdatePersonAnnualIncome: (personId: string, annualIncome: number) => void
  onUpdatePersonAnnualPension: (personId: string, annualPension: number) => void
  onDeletePerson: (id: string) => void
  onAddPerson: () => void
  onAddAccount: (personId: string, type: 'RRSP' | 'TFSA') => void
  onDeleteAccount: (personId: string, accountId: string) => void
  onUpdateAccountBalance: (personId: string, accountId: string, balance: number) => void
  onUpdateAccountContribution: (personId: string, accountId: string, contribution: number) => void
  expectedReturn: number
  setExpectedReturn: (value: number) => void
  inflationRate: number
  setInflationRate: (value: number) => void
  replacementRate: number
  setReplacementRate: (value: number) => void
  withdrawalRate: number
  setWithdrawalRate: (value: number) => void
}

export function PlanTab({
  people,
  selectedPersonId,
  onSelectPerson,
  onUpdatePerson,
  onUpdatePersonAnnualIncome,
  onUpdatePersonAnnualPension,
  onDeletePerson,
  onAddPerson,
  onAddAccount,
  onDeleteAccount,
  onUpdateAccountBalance,
  onUpdateAccountContribution,
  expectedReturn,
  setExpectedReturn,
  inflationRate,
  setInflationRate,
  replacementRate,
  setReplacementRate,
  withdrawalRate,
  setWithdrawalRate
}: PlanTabProps) {
  return (
    <div className="space-y-6">
      <button
        onClick={onAddPerson}
        className="w-full px-4 py-3 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-sm font-medium transition-all"
      >
        ➕ Add Person
      </button>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-4 sm:p-6">
        <PersonSelector
          people={people}
          selectedPersonId={selectedPersonId}
          onSelect={onSelectPerson}
        />
        <PersonForm
          people={people}
          selectedPersonId={selectedPersonId}
          onSelect={onSelectPerson}
          onUpdatePerson={onUpdatePerson}
          onUpdatePersonAnnualIncome={onUpdatePersonAnnualIncome}
          onUpdatePersonAnnualPension={onUpdatePersonAnnualPension}
          onDeletePerson={onDeletePerson}
          onAddAccount={onAddAccount}
          onDeleteAccount={onDeleteAccount}
          onUpdateAccountBalance={onUpdateAccountBalance}
          onUpdateAccountContribution={onUpdateAccountContribution}
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
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 p-4 sm:p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No people added yet. Click the button above to add someone.</p>
        </div>
      )}
    </div>
  )
}
