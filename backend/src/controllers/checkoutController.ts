import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { sendOrderConfirmationEmail } from '../utils/email';

const prisma = new PrismaClient();

export const checkoutController = {
  async createOrder(req: Request, res: Response) {
    const { addressId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
      // Start transaction with increased timeout
      const result = await prisma.$transaction(async (prisma) => {
        // Get user's cart with products
        const cart = await prisma.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        });

        if (!cart?.items.length) {
          throw new Error('Cart is empty');
        }

        // Get shipping address
        const address = await prisma.shippingAddress.findUnique({
          where: { id: addressId }
        });

        if (!address) {
          throw new Error('Invalid shipping address');
        }

        // Group items by seller
        const itemsBySeller: Record<string, typeof cart.items> = {};
        for (const item of cart.items) {
          const sellerId = item.product.sellerId;
          if (!itemsBySeller[sellerId]) {
            itemsBySeller[sellerId] = [];
          }
          itemsBySeller[sellerId].push(item);
        }

        // Verify product availability and update quantities
        for (const item of cart.items) {
          const product = await prisma.product.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (product.status !== 'ACTIVE') {
            throw new Error(`Product ${product.title} is no longer available`);
          }

          if (product.quantity < item.quantity) {
            throw new Error(`Insufficient quantity for ${product.title}`);
          }

          // Update product quantity
          const newQuantity = product.quantity - item.quantity;
          await prisma.product.update({
            where: { id: product.id },
            data: {
              quantity: newQuantity,
              status: newQuantity === 0 ? 'SOLD' : 'ACTIVE'
            }
          });
        }

        // Create orders for each seller
        const orders = await Promise.all(
          Object.entries(itemsBySeller).map(async ([sellerId, items]) => {
            const totalAmount = items.reduce(
              (sum, item) => sum + Number(item.product.price) * item.quantity,
              0
            );

            return prisma.order.create({
              data: {
                buyerId: userId,
                sellerId: sellerId,
                totalAmount: new Prisma.Decimal(totalAmount),
                shippingAddress: address as any,
                items: {
                  create: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                  }))
                },
                status: 'PENDING'
              },
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
          })
        );

        // Clear the cart
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });

        return orders; // Return orders from transaction
      }, {
        timeout: 15000, // Increase timeout to 15 seconds
        maxWait: 20000 // Maximum time to wait for transaction to start
      });

      // Send confirmation emails outside of transaction
      for (const order of result) {
        try {
          await sendOrderConfirmationEmail(order);
        } catch (emailError) {
          console.error('Failed to send email for order:', order.id, emailError);
        }
      }

      // Send response
      return res.status(201).json({ 
        message: 'Orders created successfully',
        orders: result.map(order => ({
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          items: order.items.length
        }))
      });

    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Error processing checkout',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};