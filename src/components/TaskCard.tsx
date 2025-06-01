import { useBoardStore } from '../store/useBoardStore';
import { useTaskCard } from '../hooks/useTaskCard';
import { TaskActions } from './TaskActions';
import { ConfirmDialog } from './ConfirmDialog';
import { Task } from '../types';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskEditForm } from './TaskEditForm';
import { TaskTitle } from './TaskTitle';

interface TaskCardProps {
  task: Task;
  highlight?: boolean;
}

export function TaskCard({ task, highlight }: TaskCardProps) {
  const { state, setState, inputRef, sortableProps } = useTaskCard(task);
  const {
    toggleTaskComplete,
    updateTaskTitle,
    deleteTask,
    toggleTaskSelection,
    selectedTasks,
  } = useBoardStore();

  const handleEditSubmit = () => {
    if (state.editedTitle.trim() !== task.title) {
      updateTaskTitle(task.id, state.editedTitle.trim());
    }
    setState(prev => ({ ...prev, isEditing: false }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
  };

  const handleTaskClick = () => {
    if (!state.isEditing) {
      toggleTaskSelection(task.id);
    }
  };

  const isSelected = selectedTasks.includes(task.id);

  return (
    <div
      ref={sortableProps.setNodeRef}
      style={sortableProps.style}
      className={`group relative flex items-start gap-2 rounded-lg bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        task.completed ? 'bg-gray-50/80' : ''
      } ${isSelected ? 'ring-2 ring-primary' : ''} ${
        highlight ? 'ring-2 ring-primary ring-opacity-50' : ''
      } ${sortableProps.isDragging ? 'opacity-50 shadow-lg ring-2 ring-primary/30 rotate-2' : ''}`}
      onClick={handleTaskClick}
      {...sortableProps.attributes}
      {...sortableProps.listeners}
    >
      <TaskCheckbox
        isSelected={isSelected}
        onChange={() => toggleTaskSelection(task.id)}
      />

      <div className="flex-grow min-w-0">
        {state.isEditing ? (
          <TaskEditForm
            ref={inputRef}
            value={state.editedTitle}
            onChange={(value) => setState(prev => ({ ...prev, editedTitle: value }))}
            onKeyDown={handleKeyDown}
            onCancel={() => setState(prev => ({ 
              ...prev, 
              isEditing: false, 
              editedTitle: task.title 
            }))}
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
        onComplete={() => toggleTaskComplete(task.id)}
        onEdit={() => setState(prev => ({ ...prev, isEditing: true }))}
        onDelete={() => setState(prev => ({ ...prev, showDeleteConfirm: true }))}
      />

      <ConfirmDialog
        isOpen={state.showDeleteConfirm}
        onClose={() => setState(prev => ({ ...prev, showDeleteConfirm: false }))}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
}