import { useCallback, useMemo } from 'react';
import { useColumn } from '../hooks/useColumn';
import { highlightSearchTerm, validateTitle } from '../utils/columnUtils';
import { ConfirmDialog } from './modals/ConfirmDialog';
import { useBoardStore } from '../store/useBoardStore';
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ColumnProps, Task } from '../types';
import TaskCard from './task/TaskCard';

export function Column({ column, tasks, searchTerm }: ColumnProps) {
  const { state, setState, refs, sortableProps } = useColumn({ column });
  const { addTask, deleteColumn, updateColumnTitle } = useBoardStore();

  const handleEditSubmit = useCallback(() => {
    const trimmedTitle = state.editedTitle.trim();
    if (validateTitle(trimmedTitle) && trimmedTitle !== column.title) {
      updateColumnTitle(column.id, trimmedTitle);
    }
    setState(prev => ({ ...prev, isEditing: false }));
  }, [state.editedTitle, column.title, column.id, updateColumnTitle, setState]);

  const handleAddTask = useCallback(() => {
    const trimmedTitle = state.newTaskTitle.trim();
    if (validateTitle(trimmedTitle)) {
      addTask(column.id, trimmedTitle);
      setState(prev => ({ ...prev, newTaskTitle: '', isAddingTask: false }));
    }
  }, [state.newTaskTitle, column.id, addTask, setState]);

  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    action: 'edit' | 'add' = 'edit'
  ) => {
    const actions = {
      edit: {
        Enter: handleEditSubmit,
        Escape: () => setState(prev => ({
          ...prev,
          editedTitle: column.title,
          isEditing: false
        }))
      },
      add: {
        Enter: (e: React.KeyboardEvent) => {
          e.preventDefault();
          handleAddTask();
        },
        Escape: () => setState(prev => ({
          ...prev,
          newTaskTitle: '',
          isAddingTask: false
        }))
      }
    };

    const handler = actions[action][e.key as 'Enter' | 'Escape'];
    if (handler) handler(e);
  }, [handleEditSubmit, handleAddTask, column.title, setState]);

  const taskMap = useMemo(() => 
    new Map(tasks.map(task => [task.id, task])),
    [tasks]
  );

  const tasksInColumn = useMemo(() => 
    column.taskIds
      .map(id => taskMap.get(id))
      .filter((task): task is Task => Boolean(task)),
    [column.taskIds, taskMap]
  );

  const handleDropdownToggle = useCallback(() => {
    setState(prev => ({ ...prev, showDropdown: !prev.showDropdown }));
  }, [setState]);

  const handleEditTitleClick = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: true, showDropdown: false }));
  }, [setState]);

  const handleDeleteClick = useCallback(() => {
    setState(prev => ({ ...prev, showDeleteConfirm: true, showDropdown: false }));
  }, [setState]);

  const handleCancelEdit = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: false, editedTitle: column.title }));
  }, [column.title, setState]);

  const handleStartAddTask = useCallback(() => {
    setState(prev => ({ ...prev, isAddingTask: true }));
  }, [setState]);

  const handleCancelAddTask = useCallback(() => {
    setState(prev => ({ ...prev, isAddingTask: false, newTaskTitle: '' }));
  }, [setState]);

  const handleConfirmDelete = useCallback(() => {
    deleteColumn(column.id);
    setState(prev => ({ ...prev, showDeleteConfirm: false }));
  }, [column.id, deleteColumn, setState]);

  const handleCloseDeleteConfirm = useCallback(() => {
    setState(prev => ({ ...prev, showDeleteConfirm: false }));
  }, [setState]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, editedTitle: e.target.value }));
  }, [setState]);

  const handleTaskInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, newTaskTitle: e.target.value }));
  }, [setState]);

  const handleTaskInputBlur = useCallback(() => {
    if (!state.newTaskTitle.trim()) {
      setState(prev => ({ ...prev, isAddingTask: false, newTaskTitle: '' }));
    }
  }, [state.newTaskTitle, setState]);

  return (
    <div
      ref={sortableProps.setNodeRef}
      style={sortableProps.style}
      className="flex w-78 flex-shrink-0 flex-col rounded-xl bg-[#ebecf0] shadow-sm cursor-grab active:cursor-grabbing transition-all"
      {...sortableProps.attributes}
      {...sortableProps.listeners}
    >
      <div className="flex justify-between gap-2 p-2">
        <div className="flex items-center gap-2 flex-1">
          {state.isEditing ? (
            <div className="flex-1">
              <input
                ref={refs.titleInput}
                type="text"
                value={state.editedTitle}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter list title..."
                className="w-full rounded-lg bg-white px-2 py-1.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 focus:border-blue-200 focus:ring-1 focus:ring-blue-200 focus:outline-none"
              />
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex flex-1 items-center justify-center h-7 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={!state.editedTitle.trim() || state.editedTitle.trim() === column.title}
                  className="flex flex-1 items-center justify-center gap-1.5 px-3 h-7 rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <h3
              className="text-sm font-medium text-gray-700 px-2 py-1 cursor-grab active:cursor-grabbing rounded flex-1"
              onDoubleClick={() => setState(prev => ({ ...prev, isEditing: true }))}
              {...sortableProps.listeners}
            >
              {column.title}
            </h3>
          )}
        </div>

        <div className="relative" ref={refs.dropdown}>
          <button
            onClick={handleDropdownToggle}
            className="rounded p-1.5 text-gray-500"
          >
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </button>

          {state.showDropdown && (
            <ul className="absolute right-0 z-10 mt-1 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5">
              <li
                onClick={handleEditTitleClick}
                className="cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Edit Title
              </li>
              <li
                onClick={handleDeleteClick}
                className="cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Delete List
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="flex-grow space-y-2 overflow-y-auto p-2">
        <SortableContext
          items={column.taskIds}
          strategy={verticalListSortingStrategy}
        >
          {tasksInColumn.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              highlight={highlightSearchTerm(task.title, searchTerm)}
            />
          ))}
        </SortableContext>
      </div>

      {state.isAddingTask ? (
        <div className="p-2" ref={refs.addTask}>
          <textarea
            ref={refs.taskInput}
            value={state.newTaskTitle}
            onChange={handleTaskInputChange}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            onBlur={handleTaskInputBlur}
            placeholder="Enter a title for this card..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-700 shadow-sm focus:border-blue-200 focus:ring-1 focus:ring-blue-200 focus:outline-none resize-none"
            rows={2}
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleCancelAddTask}
              className="flex flex-1 items-center justify-center h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              disabled={!state.newTaskTitle.trim()}
              className="flex flex-1 items-center justify-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleStartAddTask}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-400 hover:text-gray-600 rounded-lg m-2 mb-4"
        >
          <PlusIcon className="h-4 w-4" />
          Add a card
        </button>
      )}

      <ConfirmDialog
        isOpen={state.showDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete List"
        message={`Are you sure you want to delete "${column.title}" list? This will also delete all tasks in this list.`}
      />
    </div>
  );
}