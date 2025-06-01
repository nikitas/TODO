import { CheckCircleIcon, PencilIcon, TrashIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

interface TaskActionsProps {
  isEditing: boolean;
  isSelected: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskActions({
  isEditing,
  isSelected,
  isCompleted,
  onComplete,
  onEdit,
  onDelete
}: TaskActionsProps) {
  return (
    <div className={`absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity ${
      isEditing ? 'hidden' : isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
    }`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className={`rounded p-1.5 hover:bg-gray-100 ${
          isCompleted ? 'text-gray-400 hover:text-gray-900' : 'text-gray-300 hover:text-green-500'
        } touch-manipulation`}
      >
        {isCompleted ? (
          <MinusCircleIcon className="h-4 w-4" />
        ) : (
          <CheckCircleIcon className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="rounded p-1.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 touch-manipulation"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="rounded p-1.5 text-gray-300 hover:bg-gray-100 hover:text-red-500 touch-manipulation"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}