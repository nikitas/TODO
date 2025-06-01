import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskCardState } from '../types';

export function useTaskCard(task: Task) {
  const [state, setState] = useState<TaskCardState>({
    isEditing: false,
    editedTitle: task.title,
    showDeleteConfirm: false
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (state.isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isEditing]);

  return {
    state,
    setState,
    inputRef,
    sortableProps: { attributes, listeners, setNodeRef, style, isDragging }
  };
}