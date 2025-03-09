import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password is too long" }),
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username is too long" })
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" })
});

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    res.status(400).json({
      message: 'Invalid input'
    });
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    res.status(400).json({
      message: 'Invalid input'
    });
  }
};