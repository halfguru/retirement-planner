import type { Person } from '@/hooks/usePeopleManagement'

interface PersonSelectorProps {
  people: Person[]
  selectedPersonId: string | null
  onSelect: (id: string) => void
}

export function PersonSelector({ people, selectedPersonId, onSelect }: PersonSelectorProps) {
  if (people.length <= 1) return null

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {people.map((person) => (
        <button
          key={person.id}
          onClick={() => onSelect(person.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            selectedPersonId === person.id
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {person.name}
        </button>
      ))}
    </div>
  )
}
