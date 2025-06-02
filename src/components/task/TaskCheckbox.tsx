import React from 'react';

interface TaskCheckboxProps {
  isSelected: boolean;
  onChange: () => void;
}

function TaskCheckbox({ isSelected, onChange }: TaskCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default React.memo(TaskCheckbox);