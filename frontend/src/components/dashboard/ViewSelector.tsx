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
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="view-select" className="text-sm text-gray-600 dark:text-gray-400">
          View:
        </label>
        <select
          id="view-select"
          value={portfolioView}
          onChange={(e) => onViewChange(e.target.value as 'combined' | 'individual')}
          className="px-3 py-2 text-sm rounded-lg border-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="combined">Household</option>
          <option value="individual">Individual</option>
        </select>
      </div>

      {portfolioView === 'individual' && (
        <div className="flex items-center gap-2">
          <label htmlFor="person-select" className="text-sm text-gray-600 dark:text-gray-400">
            Person:
          </label>
          <select
            id="person-select"
            value={selectedPortfolioPersonId || ''}
            onChange={(e) => onPersonChange(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
