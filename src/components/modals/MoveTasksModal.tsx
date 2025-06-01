import { useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../../store/useBoardStore';
import type { Column } from '../../types';

interface MoveTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoveTasksModal({ isOpen, onClose }: MoveTasksModalProps) {
  const { columns, moveSelectedTasks } = useBoardStore();

  const handleMove = useCallback(
    (columnId: string) => {
      moveSelectedTasks(columnId);
      onClose();
    },
    [moveSelectedTasks, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Move Tasks</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {columns.map((column: Column) => (
            <button
              key={column.id}
              onClick={() => handleMove(column.id)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {column.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}