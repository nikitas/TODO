import { forwardRef } from 'react'
import { 
  FunnelIcon, 
  ChevronDownIcon,
  CheckCircleIcon,
  MinusCircleIcon 
} from '@heroicons/react/24/outline'
import type { FilterDropdownProps } from '../../types'

export const FilterDropdown = forwardRef<HTMLDivElement, FilterDropdownProps>(
  ({ filter, setFilter, showDropdown, setShowDropdown, filters }, ref) => {
    const getFilterIcon = (value: string) => {
      switch (value) {
        case 'completed':
          return <CheckCircleIcon className="h-4 w-4" />
        case 'incomplete':
          return <MinusCircleIcon className="h-4 w-4" />
        default:
          return <FunnelIcon className="h-5 w-5 text-gray-400" />
      }
    }

    const selectedFilter = filters.find((f) => f.value === filter);

    return (
      <div className="relative flex-shrink-0" ref={ref}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white md:px-4 px-2 py-3 text-sm text-gray-700 shadow-sm hover:bg-gray-50 h-[50px] md:min-w-[140px] min-w-0 justify-between"
        >
          <div className="flex items-center gap-1.5">
            {getFilterIcon(filter)}
            <span className="hidden md:inline">
              {selectedFilter?.label}
            </span>
          </div>
          <ChevronDownIcon 
            className="h-5 w-5 text-gray-400 md:ml-0 -ml-1" 
          />
        </button>

        {showDropdown && (
          <ul className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
            {filters.map((filterOption) => (
              <li
                key={filterOption.value}
                onClick={() => {
                  setFilter(filterOption.value)
                  setShowDropdown(false)
                }}
                className={`cursor-pointer px-4 py-2 text-sm flex items-center gap-2 ${
                  filter === filterOption.value
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {getFilterIcon(filterOption.value)}
                <span>{filterOption.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

FilterDropdown.displayName = 'FilterDropdown'