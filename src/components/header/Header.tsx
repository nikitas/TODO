import React, { useCallback, useMemo, useState } from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { useHeaderState } from '../../hooks/useHeaderState';
import { FilterOption } from '../../types';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';
import { MoveTasksModal } from '../modals/MoveTasksModal';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import SelectedTasksBar from './SelectedTasksBar';

const filters: FilterOption[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'completed', label: 'Completed' },
  { value: 'incomplete', label: 'Incomplete' },
];

export function Header() {
  const [showMoveModal, setShowMoveModal] = useState(false);
  const { state, actions, refs } = useHeaderState();
  const { selectedTasks } = useBoardStore();

  const hasSelectedTasks = useMemo(() => selectedTasks.length > 0, [selectedTasks]);

  const suggestions = useMemo(
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

  // Memoize handlers
  const handleBulkDelete = useCallback(() => {
    state.selectedTasks.forEach(actions.deleteTask);
    actions.clearSelectedTasks();
  }, [state.selectedTasks, actions]);

  const handleBulkComplete = useCallback(() => {
    const allCompleted = state.selectedTasks.every(
      (taskId) => useBoardStore.getState().tasks[taskId]?.completed
    );

    state.selectedTasks.forEach((taskId) => {
      const task = useBoardStore.getState().tasks[taskId];
      if (task && task.completed === allCompleted) {
        actions.toggleTaskComplete(taskId);
      }
    });
  }, [state.selectedTasks, actions]);

  const handleSuggestionClick = useCallback((suggestion: { title: string }) => {
    actions.setSearchTerm(suggestion.title);
  }, [actions]);

  const handleMoveModalClose = useCallback(() => {
    setShowMoveModal(false);
  }, []);

  const handleDeleteConfirmClose = useCallback(() => {
    actions.setShowDeleteConfirm(false);
  }, [actions]);

  const handleMoveModalOpen = useCallback(() => {
    setShowMoveModal(true);
  }, []);

  const handleDeleteConfirmOpen = useCallback(() => {
    actions.setShowDeleteConfirm(true);
  }, [actions]);

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
              onSuggestionClick={handleSuggestionClick}
              showSuggestions={state.showSuggestions && suggestions.length > 0}
            />
          </div>
          {hasSelectedTasks && (
            <SelectedTasksBar
              count={state.selectedTasks.length}
              onClear={actions.clearSelectedTasks}
              onComplete={handleBulkComplete}
              onDelete={handleDeleteConfirmOpen}
              onMove={handleMoveModalOpen}
              allCompleted={state.selectedTasks.every(
                (taskId) => useBoardStore.getState().tasks[taskId]?.completed
              )}
            />
          )}
        </div>

        {/* Right side with filters */}
        <div className="flex-shrink-0">
          <FilterDropdown
            ref={refs.filterRef}
            filter={state.filter}
            setFilter={actions.setFilter}
            showDropdown={state.showFilterDropdown}
            setShowDropdown={actions.setShowFilterDropdown}
            filters={filters}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={state.showDeleteConfirm}
        onClose={handleDeleteConfirmClose}
        onConfirm={handleBulkDelete}
        title="Delete Tasks"
        message={`Are you sure you want to delete ${state.selectedTasks.length} selected ${state.selectedTasks.length === 1 ? 'task' : 'tasks'
          }?`}
      />

      <MoveTasksModal
        isOpen={showMoveModal}
        onClose={handleMoveModalClose}
      />
    </header>
  );
}

export default React.memo(Header);