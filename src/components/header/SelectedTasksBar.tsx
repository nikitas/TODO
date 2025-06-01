import { 
  XMarkIcon, 
  CheckCircleIcon, 
  TrashIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline'

interface SelectedTasksBarProps {
  count: number;
  onClear: () => void;
  onComplete: () => void;
  onDelete: () => void;
  allCompleted: boolean;
}

export function SelectedTasksBar({ 
  count, 
  onClear, 
  onComplete, 
  onDelete, 
  allCompleted 
}: SelectedTasksBarProps) {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <span className="text-sm font-medium text-gray-600">
        {count} selected
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {allCompleted ? (
            <MinusCircleIcon className="h-4 w-4" />
          ) : (
            <CheckCircleIcon className="h-4 w-4" />
          )}
          <span className="hidden md:inline">
            {allCompleted ? 'Uncomplete' : 'Complete'}
          </span>
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
          <span className="hidden md:inline">Delete</span>
        </button>

        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors ml-2"
        >
          <XMarkIcon className="h-4 w-4" />
          <span className="hidden md:inline">Clear</span>
        </button>
      </div>
    </div>
  )
}