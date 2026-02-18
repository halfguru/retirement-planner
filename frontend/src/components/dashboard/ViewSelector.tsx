import type { Person } from '@/hooks/usePeopleManagement'

interface ViewSelectorProps {
  portfolioView: 'combined' | 'individual'
  onViewChange: (view: 'combined' | 'individual') => void
  selectedPortfolioPersonId: string | null
  people: Person[]
  onPersonChange: (personId: string) => void
}

export function ViewSelector({
  portfolioView,
  onViewChange,
  selectedPortfolioPersonId,
  people,
  onPersonChange
}: ViewSelectorProps) {
  if (people.length <= 1) return null

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('combined')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            portfolioView === 'combined'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Household
        </button>
        <button
          onClick={() => onViewChange('individual')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            portfolioView === 'individual'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Individual
        </button>
      </div>
      {portfolioView === 'individual' && (
        <div className="flex gap-2">
          {people.map((person) => (
            <button
              key={person.id}
              onClick={() => onPersonChange(person.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedPortfolioPersonId === person.id
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {person.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
