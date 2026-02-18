import { useState, useEffect, useRef, useMemo } from 'react'
import type { Person } from '@/hooks/usePeopleManagement'
import { InfoTooltip } from './InfoTooltip'
import { AccountCard } from './AccountCard'
import { formatCurrency } from '@/hooks/usePeopleManagement'

function NumberInput({ value, onChange, step, min }: { value: number, onChange: (val: number) => void, step: number, min?: number }) {
  const [focused, setFocused] = useState(false)

  const displayValue = useMemo(() => {
    if (!focused) {
      return value === 0 ? '' : formatCurrency(value)
    } else {
      return value === 0 ? '' : String(value)
    }
  }, [value, focused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '')
    const num = parseFloat(raw) || 0
    if (min === undefined || num >= min) {
      onChange(num)
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        step={step}
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        data-lpignore="true"
        className="number-input w-full px-3 py-2 pr-8 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded"
        style={{
          caretColor: '#1f2937',
        }}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
        $
      </span>
      <style>{`
        .number-input::-webkit-autofill,
        .number-input:-webkit-autofill,
        .number-input::-webkit-autofill:hover,
        .number-input::-webkit-autofill:focus {
          -webkit-text-fill-color: #111827;
          -webkit-box-shadow: 0 0 0 30px #fff inset;
          background-color: #fff !important;
          background-image: none !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .number-input:-webkit-autofill:hover,
        .number-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #111827;
          -webkit-box-shadow: 0 0 0 30px #fff inset;
          background-color: #fff !important;
          background-image: none !important;
        }
        @media (prefers-color-scheme: dark) {
          .number-input::-webkit-autofill,
          .number-input:-webkit-autofill,
          .number-input::-webkit-autofill:hover,
          .number-input::-webkit-autofill:focus {
            -webkit-text-fill-color: #f3f4f6;
            -webkit-box-shadow: 0 0 0 30px #374151 inset;
            background-color: #374151 !important;
            background-image: none !important;
          }
        }
      `}</style>
    </div>
  )
}

interface PersonFormProps {
  people: Person[]
  selectedPersonId: string | null
  onSelect: (id: string) => void
  onUpdatePerson: (id: string, field: keyof Person, value: string | number) => void
  onUpdatePersonAnnualIncome: (personId: string, annualIncome: number) => void
  onUpdatePersonAnnualPension: (personId: string, annualPension: number) => void
  onDeletePerson: (id: string) => void
  onAddAccount: (personId: string, type: 'RRSP' | 'TFSA') => void
  onDeleteAccount: (personId: string, accountId: string) => void
  onUpdateAccountBalance: (personId: string, accountId: string, balance: number) => void
  onUpdateAccountContribution: (personId: string, accountId: string, contribution: number) => void
}

export function PersonForm({
  people,
  selectedPersonId,
  onSelect,
  onUpdatePerson,
  onUpdatePersonAnnualIncome,
  onUpdatePersonAnnualPension,
  onDeletePerson,
  onAddAccount,
  onDeleteAccount,
  onUpdateAccountBalance,
  onUpdateAccountContribution
}: PersonFormProps) {
  const [showAddMenu, setShowAddMenu] = useState<null | string>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (people.length > 0 && (!selectedPersonId || !people.find(p => p.id === selectedPersonId))) {
      onSelect(people[0].id)
    }
  }, [people, selectedPersonId, onSelect])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (menuContainerRef.current && !menuContainerRef.current.contains(target) && !target.closest('[data-add-menu-trigger]')) {
        setShowAddMenu(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const person = people.find(p => p.id === selectedPersonId) || people[0]
  if (!person) return null

  const canDeletePerson = people.length > 1

  return (
    <div ref={menuContainerRef}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        👤 Person Details
      </h2>
      <div className="mb-4">
        <input
          type="text"
          value={person.name}
          onChange={(e) => onUpdatePerson(person.id, 'name', e.target.value)}
          className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Person's name"
        />
      </div>
      <div className="space-y-4">
        <div>
          <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Annual Income
            <InfoTooltip text="This person's annual income before retirement" />
          </div>
          <NumberInput
            value={person.annualIncome || 0}
            onChange={(val) => onUpdatePersonAnnualIncome(person.id, val)}
            step={5000}
            min={0}
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Annual Pension (CPP/Employee)
            <InfoTooltip text="Expected annual pension income at retirement (CPP, employer pension, etc.)" />
          </div>
          <NumberInput
            value={person.annualPension || 0}
            onChange={(val) => onUpdatePersonAnnualPension(person.id, val)}
            step={1000}
            min={0}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Age
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={person.currentAge}
              onChange={(e) => onUpdatePerson(person.id, 'currentAge', e.target.valueAsNumber)}
              className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Retirement Age
            </label>
            <input
              type="number"
              min={person.currentAge + 1}
              max={100}
              value={person.retirementAge}
              onChange={(e) => onUpdatePerson(person.id, 'retirementAge', e.target.valueAsNumber)}
              className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
            />
          </div>
        </div>

        {person.retirementAge <= person.currentAge && (
          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
            ⚠️ Retirement age must be greater than current age
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Accounts
          </label>
          {person.accounts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic py-2">No accounts added</p>
          ) : (
            <div className="space-y-3">
              {person.accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onDelete={() => onDeleteAccount(person.id, account.id)}
                  onUpdateBalance={(balance: number) => onUpdateAccountBalance(person.id, account.id, balance)}
                  onUpdateContribution={(contribution: number) => onUpdateAccountContribution(person.id, account.id, contribution)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowAddMenu(person.id)}
            data-add-menu-trigger
            className="w-full px-4 py-2 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm font-medium transition-all"
          >
            ➕ Add Account
          </button>
          {showAddMenu === person.id && (
            <div data-add-menu className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
              <button
                onClick={() => {
                  onAddAccount(person.id, 'RRSP')
                  setShowAddMenu(null)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                RRSP
              </button>
              <button
                onClick={() => {
                  onAddAccount(person.id, 'TFSA')
                  setShowAddMenu(null)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                TFSA
              </button>
            </div>
          )}
        </div>

        {canDeletePerson && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onDeletePerson(person.id)}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
            >
              Delete this person
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
