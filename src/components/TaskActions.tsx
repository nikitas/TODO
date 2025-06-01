import { CheckCircleIcon, PencilIcon, TrashIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';

interface TaskActionsProps {
  isEditing: boolean;
  isSelected: boolean;
  isCompleted: boolean;
  onComplete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function TaskActions({
  isEditing,
  isSelected,
  isCompleted,
  onComplete,
  onEdit,
  onDelete
}: TaskActionsProps) {
  const handleAction = useCallback((e: React.MouseEvent, action: (e: React.MouseEvent) => void) => {
    e.stopPropagation();
    e.preventDefault();
    action(e);
    return false; // Prevent any bubbling
  }, []);

  return (
    <div
      className={`absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity ${
        isEditing ? 'hidden' : isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}
      onClick={e => e.stopPropagation()} // Catch any bubbled clicks
    >
      <button
        onClick={(e) => handleAction(e, onComplete)}
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
        onClick={(e) => handleAction(e, onEdit)}
        className="rounded p-1.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 touch-manipulation"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => handleAction(e, onDelete)}
        onMouseDown={e => e.stopPropagation()} // Prevent mousedown bubbling
        onMouseUp={e => e.stopPropagation()} // Prevent mouseup bubbling
        className="rounded p-1.5 text-gray-300 hover:bg-gray-100 hover:text-red-500 touch-manipulation"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}