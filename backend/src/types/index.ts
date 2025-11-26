import { Document } from 'mongoose';

// Task Status Enum
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

// Task Interface
export interface ITask {
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Task Document Interface (for MongoDB)
export interface ITaskDocument extends ITask, Document {}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Weekly Summary Response
export interface WeeklySummary {
  currentWeek: {
    completed: number;
    pending: number;
    progress: number;
    tasks: ITask[];
  };
}

// Task Query Params
export interface TaskQueryParams {
  search?: string;
  status?: TaskStatus;
  date?: string;
  startDate?: string;
  endDate?: string;
}