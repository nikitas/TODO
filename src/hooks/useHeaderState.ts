import { useState, useRef, useEffect, useCallback } from 'react';
import { useBoardStore } from '../store/useBoardStore';

export function useHeaderState() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    selectedTasks,
    deleteTask,
    toggleTaskComplete,
    clearSelectedTasks,
  } = useBoardStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update showSuggestions when searchTerm changes
  useEffect(() => {
    setShowSuggestions(searchTerm.length > 0);
  }, [searchTerm]);

  // Modify setSearchTerm to handle suggestions visibility
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    setShowSuggestions(term.length > 0);
  }, [setSearchTerm]);

  return {
    state: {
      showSuggestions,
      showFilterDropdown,
      showDeleteConfirm,
      searchTerm,
      filter,
      selectedTasks
    },
    actions: {
      setShowSuggestions,
      setShowFilterDropdown,
      setShowDeleteConfirm,
      setSearchTerm: handleSearchTermChange,
      setFilter,
      deleteTask,
      toggleTaskComplete,
      clearSelectedTasks
    },
    refs: {
      searchRef,
      filterRef
    }
  }
}