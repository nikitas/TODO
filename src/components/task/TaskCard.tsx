import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';

import { useBoardStore } from '../../store/useBoardStore';
import { useTaskCard } from '../../hooks/useTaskCard';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { TaskActions } from './TaskActions';
import { TaskEditForm } from './TaskEditForm';
import type { Task } from '../../types';
import TaskTitle from './TaskTitle';
import TaskCheckbox from './TaskCheckbox';

interface TaskCardProps {
  task: Task;
  highlight?: boolean;
}

function TaskCard({ task, highlight }: TaskCardProps) {
  const { state, setState, inputRef, sortableProps } = useTaskCard(task);
  const {
    toggleTaskComplete,
    updateTaskTitle,
    deleteTask,
    toggleTaskSelection,
    selectedTasks,
  } = useBoardStore();

  const handleEditSubmit = useCallback(() => {
    if (state.editedTitle.trim() !== task.title) {
      updateTaskTitle(task.id, state.editedTitle.trim());
    }
    setState(prev => ({ ...prev, isEditing: false }));
  }, [state.editedTitle, task.title, task.id, updateTaskTitle, setState]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    }
    if (e.key === 'Escape') {
      setState(prev => ({
        ...prev,
        isEditing: false,
        editedTitle: task.title
      }));
    }
  }, [handleEditSubmit, setState, task.title]);

  const handleTaskClick = useCallback(() => {
    if (!state.isEditing) {
      toggleTaskSelection(task.id);
    }
  }, [state.isEditing, toggleTaskSelection, task.id]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setState(prev => ({ ...prev, showDeleteConfirm: true }));
  }, [setState]);

  const handleModalClose = useCallback(() => {
    setState(prev => ({ ...prev, showDeleteConfirm: false }));
  }, [setState]);

  const handleDeleteConfirm = useCallback(() => {
    deleteTask(task.id);
  }, [deleteTask, task.id]);

  const handleEditChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, editedTitle: value }));
  }, [setState]);

  const handleEditCancel = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEditing: false,
      editedTitle: task.title
    }));
  }, [setState, task.title]);

  const handleStartEdit = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: true }));
  }, [setState]);

  const handleCompleteToggle = useCallback(() => {
    toggleTaskComplete(task.id);
  }, [toggleTaskComplete, task.id]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedTasks.includes(task.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex items-start gap-2 rounded-lg bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${task.completed ? 'bg-gray-50/80' : ''
        } ${isSelected ? 'ring-2 ring-primary' : ''} ${highlight ? 'ring-2 ring-primary ring-opacity-50' : ''
        } ${sortableProps.isDragging ? 'opacity-50 shadow-lg ring-2 ring-primary/30 rotate-2' : ''}`}
      onClick={handleTaskClick}
    >
      <TaskCheckbox
        isSelected={isSelected}
        onChange={handleTaskClick}
      />

      <div className="flex-grow min-w-0">
        {state.isEditing ? (
          <TaskEditForm
            ref={inputRef}
            value={state.editedTitle}
            onChange={handleEditChange}
            onKeyDown={handleKeyDown}
            onCancel={handleEditCancel}
            onSave={handleEditSubmit}
          />
        ) : (
          <TaskTitle title={task.title} completed={task.completed} />
        )}
      </div>

      <TaskActions
        isEditing={state.isEditing}
        isSelected={isSelected}
        isCompleted={task.completed}
        onComplete={handleCompleteToggle}
        onEdit={handleStartEdit}
        onDelete={handleDeleteClick}
      />

      <ConfirmDialog
        isOpen={state.showDeleteConfirm}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
}

export default React.memo(TaskCard);