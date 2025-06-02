import React from 'react';

interface TaskTitleProps {
  title: string;
  completed: boolean;
}

function TaskTitle({ title, completed }: TaskTitleProps) {
  return (
    <p className={`break-words text-sm ${completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
      {title}
    </p>
  );
}

export default React.memo(TaskTitle);