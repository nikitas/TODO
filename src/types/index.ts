export interface Task {
  id: string;
  title: string;
  completed: boolean;
  columnId: string;
  createdAt: number;
}

export interface Board {
  columns: Column[];
  tasks: Record<string, Task>;
  searchTerm: string;
  selectedTasks: string[];
  filter: 'all' | 'completed' | 'incomplete';
} 

export interface ColumnState {
  isEditing: boolean;
  editedTitle: string;
  showDropdown: boolean;
  showDeleteConfirm: boolean;
  isAddingTask: boolean;
  newTaskTitle: string;
}

export interface ColumnProps {
  column: {
    id: string;
    title: string;
  };
  tasks: Task[];
  searchTerm: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface TaskCardState {
  isEditing: boolean;
  editedTitle: string;
  showDeleteConfirm: boolean;
}

export interface FilterOption {
  value: Board['filter']
  label: string
}

export interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
  showSuggestions: boolean
}

export interface FilterDropdownProps {
  filter: Board['filter']
  setFilter: (filter: Board['filter']) => void
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
  filters: FilterOption[]
}

export interface SelectedTasksBarProps {
  count: number
  onClear: () => void
  onComplete: (completed: boolean) => void
  onDelete: () => void
}