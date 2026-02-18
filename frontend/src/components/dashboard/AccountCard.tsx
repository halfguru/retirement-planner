import { useState, useMemo } from 'react'
import type { Account } from '@/hooks/usePeopleManagement'
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
        className="number-input w-full px-3 py-2 pr-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
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
          .number-input:-webkit-autofill:focus {
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

interface AccountCardProps {
  account: Account
  onDelete: () => void
  onUpdateBalance: (balance: number) => void
  onUpdateContribution: (contribution: number) => void
}

export function AccountCard({ account, onDelete, onUpdateBalance, onUpdateContribution }: AccountCardProps) {
  return (
    <div key={account.id} className={`rounded-lg border p-3 account-${account.type.toLowerCase()}`}>
      <div className="flex gap-2 items-center mb-2">
        <span className="w-20 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wide rounded">
          {account.type}
        </span>
        <button
          onClick={onDelete}
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
          <NumberInput
            value={account.balance || 0}
            onChange={onUpdateBalance}
            step={1000}
            min={0}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Annual Contribution
          </label>
          <NumberInput
            value={account.annualContribution || 0}
            onChange={onUpdateContribution}
            step={100}
            min={0}
          />
        </div>
      </div>
    </div>
  )
}
