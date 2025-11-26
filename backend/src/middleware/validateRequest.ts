import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    res.status(400).json({
      success: false,
      message: 'Invalid task ID format',
    });
    return;
  }

  next();
};