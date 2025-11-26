import { CheckSquare, XCircle, SearchIcon, PlusIcon } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import WeekCalendar from '../components/Calandar';
import TaskItem from '../components/TaskItem';
import EditTaskModal from '../components/EditTaskModal';
import { taskApi } from '../services/api';
import type { Task } from '../services/api';

const Home = () => {
  // --- STATE ---
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 📅 Calendar/Date State (Initialized to today)
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  
  // 🔍 Search State
  const [searchQuery, setSearchQuery] = useState('');

  const hasFetchedRef = useRef(false);
  
  // --- UTILITIES ---
  
  // Formats Date object into YYYY-MM-DD string for API
  const formatDate = (date: Date) => {
    // Ensure we use the date part only (to avoid timezone issues)
    return date.toISOString().split('T')[0];
  };

  // --- API FETCHERS ---

  const fetchWeeklySummary = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getWeeklySummary();
      if (response.success) {
        setCompletedCount(response.data.currentWeek.completed);
        setPendingCount(response.data.currentWeek.pending);
        setProgress(response.data.currentWeek.progress);
      }
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ New, Corrected Function: Fetches tasks for the currently selected date
  const fetchTasksForDate = async (date: Date) => {
    const formattedDate = formatDate(date);
    try {
      setLoadingTasks(true);
      // 🔥 FIX: Calls the correct function from api.ts
      const response = await taskApi.getTasksByDate(formattedDate);
      if (response.success) setTodayTasks(response.data);
    } catch (error) {
      console.error(`Error fetching tasks for ${formattedDate}:`, error);
      setTodayTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };
  
  // Handles the actual search API call
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
        // If search is empty, revert to showing tasks for the selected date
        fetchTasksForDate(selectedDate);
        return;
    }

    try {
        setLoadingTasks(true);
        const response = await taskApi.searchTasks(searchQuery);
        if (response.success) {
            setTodayTasks(response.data);
        }
    } catch (error) {
        console.error('Search error:', error);
        setTodayTasks([]);
    } finally {
        setLoadingTasks(false);
    }
  };

  // --- USE EFFECTS ---

  // Initial Data Load (on Mount)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchWeeklySummary();
      fetchTasksForDate(selectedDate); // Initial call uses today's date
    }
  }, []); 

  // Debounced Search and Calendar Date Logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If search is cleared, fetch tasks for the current selected date
      fetchTasksForDate(selectedDate); 
      return;
    }

    // Debounced search logic (wait 400ms after user stops typing)
    const delay = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery, selectedDate]); // Listen to both search and selectedDate changes


  // --- HANDLERS ---

  // ⭐ Toggle task completion
  const handleToggleStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await taskApi.updateTaskStatus(id, newStatus);
      
      // Refresh task list based on current view mode
      searchQuery ? handleSearch() : fetchTasksForDate(selectedDate);
      fetchWeeklySummary();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // ❌ Delete task
  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(id);
        
        // Refresh task list based on current view mode
        searchQuery ? handleSearch() : fetchTasksForDate(selectedDate);
        fetchWeeklySummary();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // ✏ Edit task
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // ➕ Add new task
  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsEditModalOpen(true);
  };

  // 💾 Save task (create or update)
  const handleSaveTask = async (taskData: Partial<Task>, id?: string) => {
    try {
      if (id) {
        await taskApi.updateTask(id, taskData);
      } else {
        await taskApi.createTask(taskData as any);
      }

      // After save, refresh tasks for the currently selected date
      fetchTasksForDate(selectedDate);
      fetchWeeklySummary();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // --- RENDER ---
  
  // Format the date for the header (e.g., "Mon Nov 26")
  const dateHeader = selectedDate.toDateString().slice(0, 10);

  return (
    <div className='w-full min-h-screen relative overflow-hidden pt-16'>

      {/* 🔍 SEARCH BAR */}
      <div className='w-full flex justify-center mb-8'>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search for a task'
          className='absolute w-[339px] h-[47px] top-[37px] left-[26px] border-[1px] p-3 rounded-lg shadow-lg focus:outline-none'
        />
        <button className='cursor-pointer' onClick={handleSearch}>
          <SearchIcon className='absolute w-[24px] h-[24px] top-[60px] left-[327px] transform -translate-y-1/2' />
        </button>
      </div>

      {/* 📅 Calendar - NOW PASSING STATE HANDLERS */}
      <div className='absolute w-[355px] h-[63px] top-[96px] left-[18px]'>
        <WeekCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* 📊 Task Summary Cards (Unchanged) */}
      <div className='absolute w-[341px] h-[96px] top-[189px] left-[24px] flex justify-between'>
        {/* Completed */}
        <div className='w-[162px] h-[96px] bg-[#EFF2FF] flex gap-2 rounded-lg shadow-sm'>
          <CheckSquare className='w-6 h-6 mt-4 ml-4 text-blue-600' />
          <div className='flex flex-col mt-4 items-center'>
            <span className='text-sm w-full text-gray-500'>Task Complete</span>
            {loading ? (
              <span className='text-2xl font-bold text-gray-800'>...</span>
            ) : (
              <span className='text-2xl font-bold text-gray-800'>
                {completedCount} <span className='text-sm font-thin text-[#6E7180]'>This Week</span>
              </span>
            )}
          </div>
        </div>
        {/* Pending */}
        <div className='w-[162px] h-[96px] bg-[#FFE6E7] flex gap-2 rounded-lg shadow-sm'>
          <XCircle className='w-6 h-6 mt-4 ml-4 text-red-600' />
          <div className='flex flex-col mt-4 items-center'>
            <span className='text-sm w-full text-gray-500'>Task Pending</span>
            {loading ? (
              <span className='text-2xl font-bold text-gray-800'>...</span>
            ) : (
              <span className='text-2xl font-bold text-gray-800'>
                {pendingCount} <span className='text-sm font-thin text-[#6E7180]'>This Week</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 📈 Weekly Progress (Unchanged) */}
      <div className='absolute w-[341px] top-[305px] left-[24px]'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-lg font-semibold text-gray-800'>Weekly Progress</h3>
          <span className='text-sm font-medium text-blue-600'>{progress}%</span>
        </div>
        <div className='w-full h-5 bg-[#E0E7FF] overflow-hidden'>
          <div
            className='h-full bg-[#253C98] rounded-full transition-all duration-500 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 📝 Task List - DYNAMIC HEADER */}
      <div className='absolute w-[342px] top-[380px] left-[24px]'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {searchQuery ? 'Search Results' : `Tasks for ${dateHeader}`}
          </h3>
          <span className='text-sm font-medium text-blue-600 cursor-pointer'>View All</span>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-4 max-h-[300px] overflow-y-auto'>
          {loadingTasks ? (
            <div className='text-center py-4 text-gray-500'>Loading tasks...</div>
          ) : todayTasks.length === 0 ? (
            <div className='text-center py-4 text-gray-500'>
                {searchQuery ? 'No tasks found' : `No tasks for ${dateHeader}`}
            </div>
          ) : (
            todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))
          )}
        </div>
      </div>

      {/* ➕ Add Task */}
      <div className='absolute h-[76px] w-[76px] top-[740px] left-[160px] text-center'>
        <button
          onClick={handleAddNewTask}
          className='absolute h-full w-full flex items-center justify-center bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors cursor-pointer'
        >
          <PlusIcon className='w-full h-full' />
        </button>
      </div>

      {/* ✏ Edit/Create Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        task={selectedTask}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Home;