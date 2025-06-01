import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Suggestion {
  id: string;
  title: string;
}

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
  showSuggestions: boolean;
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  suggestions,
  onSuggestionClick,
  showSuggestions
}: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[280px] md:min-w-[480px] lg:min-w-[640px]">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks..."
        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-12 pr-10 py-3 text-base placeholder:text-gray-400 focus:border-primary-300 focus:bg-white focus:ring-1 focus:ring-primary-100 focus:outline-none transition-colors"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
      
      {showSuggestions && (
        <ul className="absolute left-0 right-0 top-full mt-1 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}