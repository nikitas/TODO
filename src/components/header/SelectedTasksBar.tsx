import { CheckIcon } from '@heroicons/react/24/solid' // Change this import to solid
import {
  CheckCircleIcon,
  TrashIcon,
  MinusCircleIcon,
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'

interface SelectedTasksBarProps {
  count: number;
  onClear: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onMove: () => void; // Add this
  allCompleted: boolean;
}

export function SelectedTasksBar({
  count,
  onClear,
  onComplete,
  onDelete,
  onMove, // Add this
  allCompleted
}: SelectedTasksBarProps) {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <CheckIcon className="h-5 w-5 text-blue-600" />
        <span>{count}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowUturnLeftIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Clear</span>
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {allCompleted ? (
            <MinusCircleIcon className="h-4 w-4" />
          ) : (
            <CheckCircleIcon className="h-4 w-4" />
          )}
          <span className="hidden lg:inline">
            {allCompleted ? 'Uncomplete' : 'Complete'}
          </span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Delete</span>
        </button>
        <button
          onClick={onMove}
          className="flex items-center justify-center gap-1.5 px-3 md:px-4 h-9 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowsRightLeftIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Move</span>
        </button>
      </div>
    </div>
  )
}