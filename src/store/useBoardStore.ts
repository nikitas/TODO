import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Board, Task } from '../types';

interface BoardStore extends Board {
  addTask: (columnId: string, title: string) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  updateTaskTitle: (taskId: string, title: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string, newIndex?: number) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  moveColumn: (sourceIndex: number, destinationIndex: number) => void;
  setSearchTerm: (term: string) => void;
  toggleTaskSelection: (taskId: string) => void;
  selectAllTasksInColumn: (columnId: string) => void;
  clearSelectedTasks: () => void;
  setFilter: (filter: Board['filter']) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
  moveSelectedTasks: (destinationColumnId: string) => void;
}

const INITIAL_STATE: Board = {
  columns: [
    { id: uuidv4(), title: 'To Do', taskIds: [] },
    { id: uuidv4(), title: 'In Progress', taskIds: [] },
    { id: uuidv4(), title: 'Done', taskIds: [] },
  ],
  tasks: {},
  searchTerm: '',
  selectedTasks: [],
  filter: 'all',
} as const;

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      
      addTask: (columnId, title) =>
        set((state) => {
          const taskId = uuidv4();
          const newTask: Task = {
            id: taskId,
            title,
            completed: false,
            columnId,
          };

          const column = state.columns.find((col) => col.id === columnId);
          if (!column) return state;

          return {
            tasks: { ...state.tasks, [taskId]: newTask },
            columns: state.columns.map((col) =>
              col.id === columnId
                ? { ...col, taskIds: [...col.taskIds, taskId] }
                : col
            ),
          };
        }),

      deleteTask: (taskId) =>
        set((state) => {
          const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;
          if (!deletedTask) return state;

          return {
            tasks: remainingTasks,
            columns: state.columns.map((col) => ({
              ...col,
              taskIds: col.taskIds.filter((id) => id !== taskId),
            })),
            selectedTasks: state.selectedTasks.filter((id) => id !== taskId),
          };
        }),

      toggleTaskComplete: (taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              completed: !state.tasks[taskId].completed,
            },
          },
        })),

      updateTaskTitle: (taskId, title) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], title },
          },
        })),

      moveTask: (taskId, sourceColumnId, destinationColumnId, newIndex) =>
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;

          const sourceColumn = state.columns.find((col) => col.id === sourceColumnId);
          const destColumn = state.columns.find((col) => col.id === destinationColumnId);
          if (!sourceColumn || !destColumn) return state;

          // Handle same column reordering
          if (sourceColumnId === destinationColumnId) {
            const currentIndex = destColumn.taskIds.indexOf(taskId);
            if (currentIndex === newIndex) return state;

            const reorderedTaskIds = [...destColumn.taskIds];
            reorderedTaskIds.splice(currentIndex, 1); // Remove from old position
            if (newIndex !== undefined) {
              reorderedTaskIds.splice(newIndex, 0, taskId); // Insert at new position
            }

            return {
              ...state,
              columns: state.columns.map((col) =>
                col.id === sourceColumnId
                  ? { ...col, taskIds: reorderedTaskIds }
                  : col
              ),
            };
          }

          // Handle moving between columns
          const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);
          const newDestTaskIds = [...destColumn.taskIds];
          
          // Insert at specific index or end
          if (typeof newIndex === 'number') {
            newDestTaskIds.splice(newIndex, 0, taskId);
          } else {
            newDestTaskIds.push(taskId);
          }

          return {
            ...state,
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId) {
                return { ...col, taskIds: newSourceTaskIds };
              }
              if (col.id === destinationColumnId) {
                return { ...col, taskIds: newDestTaskIds };
              }
              return col;
            }),
            tasks: {
              ...state.tasks,
              [taskId]: { ...task, columnId: destinationColumnId },
            },
          };
        }),

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: uuidv4(), title, taskIds: [] },
          ],
        })),

      deleteColumn: (columnId) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column) return state;

          const remainingTasks = { ...state.tasks };
          column.taskIds.forEach((taskId) => {
            delete remainingTasks[taskId];
          });

          return {
            columns: state.columns.filter((col) => col.id !== columnId),
            tasks: remainingTasks,
            selectedTasks: state.selectedTasks.filter(
              (taskId) => !column.taskIds.includes(taskId)
            ),
          };
        }),

      moveColumn: (sourceIndex, destinationIndex) =>
        set((state) => {
          const newColumns = [...state.columns];
          const [removed] = newColumns.splice(sourceIndex, 1);
          newColumns.splice(destinationIndex, 0, removed);
          return { columns: newColumns };
        }),

      setSearchTerm: (searchTerm) => set({ searchTerm }),

      toggleTaskSelection: (taskId) =>
        set((state) => ({
          selectedTasks: state.selectedTasks.includes(taskId)
            ? state.selectedTasks.filter((id) => id !== taskId)
            : [...state.selectedTasks, taskId],
        })),

      selectAllTasksInColumn: (columnId: string) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column) return state;

          const tasksToSelect = column.taskIds.filter(
            (id) => !state.selectedTasks.includes(id)
          );

          if (tasksToSelect.length === 0) {
            // If all tasks are already selected, deselect them
            return {
              ...state,
              selectedTasks: state.selectedTasks.filter(
                (id) => !column.taskIds.includes(id)
              ),
            };
          }

          return {
            ...state,
            selectedTasks: [...state.selectedTasks, ...tasksToSelect],
          };
        }),

      clearSelectedTasks: () => set({ selectedTasks: [] }),

      setFilter: (filter) => set({ filter }),

      updateColumnTitle: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, title } : col
          ),
        })),

      moveSelectedTasks: (destinationColumnId: string) =>
        set((state) => {
          const updatedTasks = { ...state.tasks };
          const selectedTasks = state.selectedTasks;

          // Update tasks with new column ID
          selectedTasks.forEach((taskId) => {
            if (updatedTasks[taskId]) {
              updatedTasks[taskId] = {
                ...updatedTasks[taskId],
                columnId: destinationColumnId,
              };
            }
          });

          // Update columns
          const updatedColumns = state.columns.map((col) => {
            if (col.id === destinationColumnId) {
              // Add tasks to destination column
              return {
                ...col,
                taskIds: [...col.taskIds, ...selectedTasks],
              };
            }
            // Remove tasks from source columns
            return {
              ...col,
              taskIds: col.taskIds.filter((id) => !selectedTasks.includes(id)),
            };
          });

          return {
            ...state,
            tasks: updatedTasks,
            columns: updatedColumns,
            selectedTasks: [], // Clear selection after move
          };
        }),
    }),
    {
      name: 'board-storage',
    }
  )
);