// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterDTO, LoginDTO, AuthResponse } from '../types/auth';

const prisma = new PrismaClient();

export class AuthController {
  // Register new user
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username }: RegisterDTO = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.email === email) {
          res.status(400).json({
            message: 'Email is already registered'
          });
          return;
        }
        if (existingUser.username === username) {
          res.status(400).json({
            message: 'Username is already taken'
          });
          return;
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: 'USER'
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true
        }
      });

      // Generate token
      const token = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        message: 'Internal server error during registration'
      });
    }
  }

  // Login user
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDTO = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        res.status(401).json({
          message: 'Invalid email or password'
        });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        res.status(401).json({
          message: 'Invalid email or password'
        });
        return;
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Internal server error during login'
      });
    }
  }
}