import { forwardRef } from 'react';

interface TaskEditFormProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const TaskEditForm = forwardRef<HTMLTextAreaElement, TaskEditFormProps>(
  ({ value, onChange, onKeyDown, onCancel, onSave }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        rows={2}
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="flex-1 rounded-lg bg-primary px-3 py-1 text-sm text-white hover:bg-primary/90 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
);

TaskEditForm.displayName = 'TaskEditForm';