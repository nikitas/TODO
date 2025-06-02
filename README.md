# Modern Todo List Application

A responsive and feature-rich todo list application built with React, TypeScript, and modern web technologies.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Features

- ✨ Modern and responsive design
- 📱 Works on desktop and mobile devices
- 🎯 Add and remove tasks
- ✅ Mark tasks as complete/incomplete
- 🔍 Search tasks by name
- 🏷️ Filter tasks by completion status
- 📋 Multiple task selection
- 🔄 Drag and drop tasks between columns
- 📊 Customizable columns
- 💾 Persistent storage using localStorage
- ✅ Select all tasks in a column

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- dnd-kit (Drag and Drop)
- Hero Icons

### Tasks
- Click the "Add Task" button in any column to create a new task
- Double-click a task to edit its title
- Use the checkbox to select tasks for bulk actions
- Use the task buttons to:
  - Mark as complete/incomplete
  - Edit title
  - Delete task

### Columns
- Click "Add Column" to create a new column
- Double-click a column title to edit it
- Use the column menu (⋯) to:
  - Edit column title
  - Delete column
- Drag columns to reorder them

### Search and Filter
- Use the search bar to find tasks by name
- Use the filter dropdown to show:
  - All tasks
  - Completed tasks
  - Incomplete tasks

### Bulk Actions
When tasks are selected:
- Mark all selected tasks as complete
- Mark all selected tasks as incomplete
- Delete all selected tasks
