import express from 'express';
import {
  createTask,
  getAllTasks,
  getTodayTasks,
  getWeekTasks,
  getWeeklySummary,
  searchTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/TaskController';
import { validateObjectId } from '../middleware/validateRequest';

const router = express.Router();

// Special routes (MUST be before /:id routes)
router.get('/today', getTodayTasks);                             // Get today's tasks
router.get('/week', getWeekTasks);                               // Get current week tasks
router.get('/summary', getWeeklySummary);                        // Get weekly summary
router.get('/search', searchTasks);                              // Search tasks

// Task CRUD routes
router.post('/', createTask);                                    // Create task
router.get('/', getAllTasks);                                    // Get all tasks
router.get('/:id', validateObjectId, getTaskById);               // Get single task
router.put('/:id', validateObjectId, updateTask);                // Update task
router.delete('/:id', validateObjectId, deleteTask);             // Delete task

// Status update route
router.patch('/:id/status', validateObjectId, updateTaskStatus); // Update task status only

export default router;