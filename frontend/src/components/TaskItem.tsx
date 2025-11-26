import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import type { Task } from '../services/api';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, currentStatus: 'pending' | 'completed') => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onDelete, onEdit }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className='flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0'>
      {/* Checkbox and Task Title */}
      <div className='flex items-center gap-3 flex-1'>
        <input
          type='checkbox'
          checked={isCompleted}
          onChange={() => onToggleStatus(task.id, task.status)}
          className='w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
        />
        <span
          className={`text-base ${
            isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center gap-3'>
        <button
          onClick={() => onDelete(task.id)}
          className='text-gray-400 hover:text-red-500 transition-colors'
        >
          <Trash2 className='w-5 h-5' />
        </button>
        <button
          onClick={() => onEdit(task)}
          className='text-gray-400 hover:text-blue-500 transition-colors'
        >
          <Edit className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;