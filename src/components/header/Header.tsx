import React from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { useHeaderState } from '../../hooks/useHeaderState';
import { FilterOption } from '../../types';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';
import { SelectedTasksBar } from './SelectedTasksBar';
import { ConfirmDialog } from '../ConfirmDialog';

const filters: FilterOption[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'completed', label: 'Completed' },
  { value: 'incomplete', label: 'Incomplete' },
];

export function Header() {
  const { state, actions, refs } = useHeaderState();

  const suggestions = React.useMemo(
    () =>
      Object.values(useBoardStore.getState().tasks)
        .filter(
          (task) =>
            task.title.toLowerCase().includes(state.searchTerm.toLowerCase()) &&
            state.searchTerm.length > 0
        )
        .map((task) => ({
          id: task.id,
          title: task.title
        }))
        .slice(0, 5),
    [state.searchTerm]
  );

  const handleBulkDelete = () => {
    state.selectedTasks.forEach(actions.deleteTask);
    actions.clearSelectedTasks();
  };

  const handleBulkComplete = () => {
    // Check if all selected tasks are completed
    const allCompleted = state.selectedTasks.every(
      (taskId) => useBoardStore.getState().tasks[taskId]?.completed
    );
    
    // Toggle to opposite state
    state.selectedTasks.forEach((taskId) => {
      const task = useBoardStore.getState().tasks[taskId];
      if (task && task.completed === allCompleted) {
        actions.toggleTaskComplete(taskId);
      }
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-1 items-center gap-4">
          <div
            className={state.selectedTasks.length > 0 ? 'hidden md:block' : 'block'}
            ref={refs.searchRef}
          >
            <SearchBar
              searchTerm={state.searchTerm}
              setSearchTerm={actions.setSearchTerm}
              suggestions={suggestions}
              onSuggestionClick={(suggestion) => {
                actions.setSearchTerm(suggestion.title);
              }}
              showSuggestions={state.showSuggestions && suggestions.length > 0}
            />
          </div>

          <FilterDropdown
            ref={refs.filterRef}
            filter={state.filter}
            setFilter={actions.setFilter}
            showDropdown={state.showFilterDropdown}
            setShowDropdown={actions.setShowFilterDropdown}
            filters={filters}
          />
        </div>

        {state.selectedTasks.length > 0 && (
          <SelectedTasksBar
            count={state.selectedTasks.length}
            onClear={actions.clearSelectedTasks}
            onComplete={handleBulkComplete}
            onDelete={() => actions.setShowDeleteConfirm(true)}
            allCompleted={state.selectedTasks.every(
              (taskId) => useBoardStore.getState().tasks[taskId]?.completed
            )}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={state.showDeleteConfirm}
        onClose={() => actions.setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Tasks"
        message={`Are you sure you want to delete ${state.selectedTasks.length} selected ${
          state.selectedTasks.length === 1 ? 'task' : 'tasks'
        }?`}
      />
    </header>
  );
}