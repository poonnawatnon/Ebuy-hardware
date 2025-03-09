import type { Request, Response } from 'express';
import { PrismaClient, Order  } from '@prisma/client';
import type { OrderStatus } from '@prisma/client';

interface UpdateStatusRequest {
    status: OrderStatus;
}
const prisma = new PrismaClient();

export const orderController = {
  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { status } = req.body as UpdateStatusRequest;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true
            }
          },
          buyer: true,
          seller: true
        }
      });
  

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Only allow buyer or seller to view order
      if (order.buyerId !== userId && order.sellerId !== userId) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
  

      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ message: 'Error fetching order' });
    }
    
  },
  async getSellerOrders(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const orders = await prisma.order.findMany({
        where: {
          sellerId: userId
        },
        include: {
          buyer: {
            select: {
              username: true,
              email: true
            }
          },
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({ orders });
    } catch (error) {
      console.error('Get seller orders error:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  },
  
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status }: UpdateStatusRequest = req.body;
      const userId = req.user?.id;

      const order = await prisma.order.findUnique({
        where: { id }
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.sellerId !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          buyer: true,
          seller: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Optionally send email notifications here
      // await sendOrderStatusUpdateEmail(updatedOrder);

      res.json(updatedOrder);
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  },
  async getBuyerOrders(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const orders = await prisma.order.findMany({
        where: {
          buyerId: userId
        },
        include: {
          seller: {
            select: {
              username: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  images: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      res.json(orders);
    } catch (error) {
      console.error('Get buyer orders error:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  }
};