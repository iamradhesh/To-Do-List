import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task } from '../services/api';

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  // Changed signature: id is now optional, data comes first
  onSave: (taskData: Partial<Task>, id?: string) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Update form when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Edit Mode
        setTitle(task.title);
        setDescription(task.description || '');
        // Safety check for date formatting
        setDate(task.date ? task.date.split('T')[0] : '');
        setStartTime(task.startTime);
        setEndTime(task.endTime);
      } else {
        // Add Mode (Reset fields)
        setTitle('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]); // Default to today
        setStartTime('');
        setEndTime('');
      }
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !startTime || !endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const taskData = {
      title,
      description,
      date,
      startTime,
      endTime,
    };

    // Pass data first, then ID if it exists
    onSave(taskData, task?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center' style={{ zIndex: 9999 }}>
      <div className='bg-white rounded-lg w-[360px] p-6 relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
        >
          <X className='w-6 h-6' />
        </button>

        {/* Dynamic Title */}
        <h2 className='text-xl font-semibold text-gray-800 mb-6'>
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* ... Existing Inputs (Title, Time, Date, Description) remain exactly the same ... */}
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Task title</label>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter task title' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
          </div>

          <div>
             <label className='block text-sm font-medium text-gray-700 mb-1'>Set Time</label>
             <div className='flex gap-2'>
               <div className='flex-1'>
                 <input type='text' value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder='Start (e.g., 10:00 AM)' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
               </div>
               <div className='flex-1'>
                 <input type='text' value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder='End (e.g., 12:00 PM)' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
               </div>
             </div>
           </div>

           <div>
             <label className='block text-sm font-medium text-gray-700 mb-1'>Set Date</label>
             <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
           </div>

           <div>
             <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
             <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Add description' rows={3} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' />
           </div>

          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              {/* Dynamic Button Text */}
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;