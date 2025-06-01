import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
}

const getInitialState = (): Board => ({
  columns: [
    { id: '1', title: 'To Do', taskIds: [] },
    { id: '2', title: 'In Progress', taskIds: [] },
    { id: '3', title: 'Done', taskIds: [] },
  ],
  tasks: {},
  searchTerm: '',
  selectedTasks: [],
  filter: 'all',
});

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      addTask: (columnId, title) =>
        set((state) => {
          const taskId = Date.now().toString();
          const newTask: Task = {
            id: taskId,
            title,
            completed: false,
            columnId,
            createdAt: Date.now(),
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
          const sourceColumn = state.columns.find((col) => col.id === sourceColumnId);
          const destColumn = state.columns.find((col) => col.id === destinationColumnId);
          if (!sourceColumn || !destColumn) return state;

          // Remove task from source column
          const newSourceTaskIds = sourceColumn.taskIds.filter(id => id !== taskId);
          
          // Insert task into destination column at specific index or end
          const newDestTaskIds = [...destColumn.taskIds];
          if (typeof newIndex === 'number') {
            newDestTaskIds.splice(newIndex, 0, taskId);
          } else {
            newDestTaskIds.push(taskId);
          }

          return {
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
              [taskId]: { ...state.tasks[taskId], columnId: destinationColumnId },
            },
          };
        }),

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: Date.now().toString(), title, taskIds: [] },
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

      selectAllTasksInColumn: (columnId) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column) return state;

          const allTasksSelected = column.taskIds.every((taskId) =>
            state.selectedTasks.includes(taskId)
          );

          return {
            selectedTasks: allTasksSelected
              ? state.selectedTasks.filter((taskId) => !column.taskIds.includes(taskId))
              : [...new Set([...state.selectedTasks, ...column.taskIds])],
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
    }),
    {
      name: 'board-storage',
    }
  )
); 