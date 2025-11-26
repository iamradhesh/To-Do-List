import axios from 'axios';



// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Get today's tasks
  getTodayTasks: async () => {
    const response = await api.get('/tasks/today');
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