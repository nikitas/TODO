import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { Column } from './Column';
import type { Task } from '../types/index'

export function Board() {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const {
    columns,
    tasks,
    searchTerm,
    filter,
    addColumn,
    moveTask,
    moveColumn,
  } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      const activeTask = tasks[activeId];
      const overTask = tasks[overId];
      
      if (!activeTask || !overTask) return;

      if (activeTask.columnId !== overTask.columnId) {
        const targetColumn = columns.find(col => col.id === overTask.columnId);
        if (!targetColumn) return;

        const overTaskIndex = targetColumn.taskIds.findIndex(id => id === overTask.id);
        moveTask(activeId, activeTask.columnId, overTask.columnId, overTaskIndex);
      } else {
        const sourceColumn = columns.find(col => col.id === activeTask.columnId);
        if (!sourceColumn) return;

        const oldIndex = sourceColumn.taskIds.indexOf(activeId);
        const newIndex = sourceColumn.taskIds.indexOf(overId);
        
        if (oldIndex !== newIndex) {
          moveTask(activeId, activeTask.columnId, activeTask.columnId, newIndex);
        }
      }
    }

    // Dropping a task over a column
    if (isActiveTask && !isOverTask) {
      const activeTask = tasks[activeId];
      const overColumn = over.id.toString();
      
      if (activeTask && activeTask.columnId !== overColumn) {
        moveTask(activeId, activeTask.columnId, overColumn);
      }
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const isColumn = active.data.current?.type === 'column';
      
      if (isColumn) {
        const oldIndex = columns.findIndex((col) => col.id === active.id);
        const newIndex = columns.findIndex((col) => col.id === over.id);
        moveColumn(oldIndex, newIndex);
      }
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    } else if (e.key === 'Escape') {
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const getFilteredTasks = (columnId: string): Task[] => {
    return Object.values(tasks)
      .filter((task: Task) => {
        if (task.columnId !== columnId) return false;
        
        const matchesSearch = searchTerm
          ? task.title.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
          
        const matchesFilter =
          filter === 'all' ||
          (filter === 'completed' && task.completed) ||
          (filter === 'incomplete' && !task.completed);
          
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => a.createdAt - b.createdAt);
  };

  return (
    <div className="h-full w-full overflow-x-auto">
      <div className="inline-flex h-full min-w-full p-4 gap-4">
        <DndContext
          sensors={sensors}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="inline-flex gap-4">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={getFilteredTasks(column.id)}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {isAddingColumn ? (
          <div className="flex h-fit w-72 flex-shrink-0 flex-col rounded-xl bg-[#ebecf0] p-2 shadow-sm">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter list title..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-200 focus:ring-1 focus:ring-blue-200 focus:outline-none"
              autoFocus
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAddingColumn(false);
                  setNewColumnTitle('');
                }}
                className="flex flex-1 items-center justify-center h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                disabled={!newColumnTitle.trim()}
                className="flex flex-1 items-center justify-center gap-1.5 px-3 h-8 rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <PlusIcon className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="flex h-fit w-72 flex-shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm text-gray-400 hover:text-gray-600 rounded-lg bg-[#ebecf0]"
          >
            <PlusIcon className="h-4 w-4" />
            Add another list
          </button>
        )}
      </div>
    </div>
  );
}