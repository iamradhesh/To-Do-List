import axios from 'axios';

// --- BASE URL CONFIGURATION FIX ---

// 1. Get the base URL (e.g., https://to-do-list-api-v1.onrender.com)
//    This is loaded from the Netlify Environment Variable VITE_API_BASE_URL
const RENDER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Define the local fallback (for running the app locally with npm run dev)
const LOCAL_BASE_URL = 'http://localhost:5000';

// 3. Determine the actual BASE_URL
const BASE_URL = RENDER_BASE_URL || LOCAL_BASE_URL;

// 💡 FIX: Append the '/api' prefix here, assuming your Express router is set up as app.use('/api', taskRouter)
// This ensures that when the final URL is constructed (e.g., for getAllTasks), 
// it correctly becomes: https://...render.com/api/tasks
const API_BASE_URL = `${BASE_URL}/api`; 

// ------------------------------------


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL, // <--- Now includes the crucial '/api' segment
  headers: {
    'Content-Type': 'application/json',
  },
});

// Task interfaces
export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface WeeklySummary {
  success: boolean;
  data: {
    currentWeek: {
      completed: number;
      pending: number;
      progress: number;
      total: number;
      tasks: Task[];
    };
  };
}

// API functions
export const taskApi = {
  // Get all tasks
  getAllTasks: async (date: string) => { // 💡 You should update this to use the date parameter
    const response = await api.get(`/tasks?date=${date}`);
    return response.data;
  },

  // Get tasks for a specific date (Updated from getTodayTasks)
  getTasksByDate: async (date: string) => { 
    // Assuming your backend uses /api/tasks?date=YYYY-MM-DD
    const response = await api.get(`/tasks?date=${date}`);
    return response.data;
  },

  // Get weekly summary
  getWeeklySummary: async (): Promise<WeeklySummary> => {
    const response = await api.get('/tasks/summary');
    return response.data;
  },

  // Create new task
  createTask: async (taskData: {
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (id: string, status: 'pending' | 'completed') => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Search tasks
  searchTasks: async (query: string) => {
    const response = await api.get(`/tasks/search?q=${query}`);
    return response.data;
  },

  // Update full task
  updateTask: async (id: string, taskData: Partial<Task>) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
};

export default api;