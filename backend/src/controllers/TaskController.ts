import { Request, Response } from 'express';
import Task from '../models/Task';
import { TaskStatus } from '../types/index';
import { getStartOfDay, getEndOfDay } from '../utils/dateHelper';
import { getCurrentWeekInfo } from '../utils/weekHelper';

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, startTime, endTime } = req.body;

    // Basic validation
    if (!title || !date || !startTime || !endTime) {
      res.status(400).json({
        success: false,
        message: 'Please provide title, date, startTime, and endTime',
      });
      return;
    }

    const task = await Task.create({
      title,
      description: description || '',
      date: new Date(date),
      startTime,
      endTime,
      status: TaskStatus.PENDING,
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message,
    });
  }
};

// Get all tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message,
    });
  }
};

// Get tasks for today
export const getTodayTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const startOfDay = getStartOfDay(today);
    const endOfDay = getEndOfDay(today);

    const tasks = await Task.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today tasks',
      error: error.message,
    });
  }
};

// Get tasks for current week
export const getWeekTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDateObj, endDateObj } = getCurrentWeekInfo();

    const tasks = await Task.find({
      date: {
        $gte: startDateObj,
        $lte: endDateObj,
      },
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching week tasks',
      error: error.message,
    });
  }
};

// Get weekly summary (completed vs pending)
export const getWeeklySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDateObj, endDateObj } = getCurrentWeekInfo();

    // DEBUG: Log the date range
    console.log('Week Start:', startDateObj);
    console.log('Week End:', endDateObj);

    const tasks = await Task.find({
      date: {
        $gte: startDateObj,
        $lte: endDateObj,
      },
    });

    // DEBUG: Log found tasks
    console.log('Tasks found:', tasks.length);
    console.log('Tasks:', tasks);

    const completed = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
    const pending = tasks.filter((task) => task.status === TaskStatus.PENDING).length;
    const total = tasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        currentWeek: {
          completed,
          pending,
          progress,
          total,
          tasks,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly summary',
      error: error.message,
    });
  }
};

// Search tasks
export const searchTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Please provide search query',
      });
      return;
    }

    const tasks = await Task.find({
      $or: [
        { title: { $regex: q as string, $options: 'i' } },
        { description: { $regex: q as string, $options: 'i' } },
      ],
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error searching tasks',
      error: error.message,
    });
  }
};

// Get single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message,
    });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, date, startTime, endTime, status } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message,
    });
  }
};

// Update task status only
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Please provide valid status (pending or completed)',
      });
      return;
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task status updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating task status',
      error: error.message,
    });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message,
    });
  }
};