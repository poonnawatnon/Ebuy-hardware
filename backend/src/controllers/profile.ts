// backend/src/controllers/profile.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    console.log('User from token:', req.user);
    
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        username: true,
        email: true,
        bio: true,
      }
    });

    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(500).json({ 
        message: 'Database error',
        error: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Error fetching profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const { username, email, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        username,
        email,
        bio
      },
      select: {
        username: true,
        email: true,
        bio: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        res.status(400).json({
          message: 'Username or email already exists',
          error: error.message
        });
      } else {
        res.status(500).json({
          message: 'Database error',
          error: error.message
        });
      }
    } else {
      res.status(500).json({
        message: 'Error updating profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};