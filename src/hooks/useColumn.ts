import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ColumnProps, ColumnState } from '../types';

export const useColumn = ({ column }: Pick<ColumnProps, 'column'>) => {
  const [state, setState] = useState<ColumnState>({
    isEditing: false,
    editedTitle: column.title,
    showDropdown: false,
    showDeleteConfirm: false,
    isAddingTask: false,
    newTaskTitle: '',
  });

  const refs = {
    titleInput: useRef<HTMLInputElement>(null),
    taskInput: useRef<HTMLTextAreaElement>(null),
    dropdown: useRef<HTMLDivElement>(null),
    addTask: useRef<HTMLDivElement>(null),
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: 'column', column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (state.isEditing && refs.titleInput.current) {
      refs.titleInput.current.focus();
    }
  }, [refs.titleInput, state.isEditing]);

  useEffect(() => {
    if (state.isAddingTask && refs.taskInput.current) {
      refs.taskInput.current.focus();
    }
  }, [refs.taskInput, state.isAddingTask]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refs.dropdown.current && !refs.dropdown.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, showDropdown: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs.dropdown]);

  return {
    state,
    setState,
    refs,
    sortableProps: { attributes, listeners, setNodeRef, style, isDragging },
  };
};