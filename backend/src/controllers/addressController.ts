import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addressController = {
  async getAddresses(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const addresses = await prisma.shippingAddress.findMany({
        where: { userId }
      });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching addresses' });
    }
  },

  async addAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const address = await prisma.shippingAddress.create({
        data: {
          ...req.body,
          userId
        }
      });
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ message: 'Error adding address' });
    }
  },

  async setDefaultAddress(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
      // Remove default from all addresses
      await prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false }
      });

      // Set new default
      const address = await prisma.shippingAddress.update({
        where: { id },
        data: { isDefault: true }
      });

      res.json(address);
    } catch (error) {
      res.status(500).json({ message: 'Error setting default address' });
    }
  },
  async createAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const address = await prisma.shippingAddress.create({
        data: {
          ...req.body,
          userId
        }
      });

      res.status(201).json(address);
    } catch (error) {
      console.error('Create address error:', error);
      res.status(500).json({ message: 'Failed to create address' });
    }
  },
};