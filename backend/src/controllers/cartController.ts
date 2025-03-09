import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cartController = {
  // Get cart items
  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Find or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    seller: {
                      select: {
                        username: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }

      res.json(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Error fetching cart' });
    }
  },

  // Add item to cart
  async addToCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      // console.log('Adding to cart for user:', userId);
      // console.log('Request body:', req.body);

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { productId, quantity = 1 } = req.body;

      // Validate product and check quantity
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { seller: true }
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.status !== 'ACTIVE') {
        return res.status(400).json({ message: 'Product is not available' });
      }

      // Prevent sellers from adding their own products
    if (product.sellerId === userId) {
      return res.status(403).json({ 
        message: 'You cannot add your own products to cart' 
      });
    }
    
      // Find or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
        });
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      const totalRequestedQuantity = existingItem 
        ? existingItem.quantity + quantity 
        : quantity;

      if (totalRequestedQuantity > product.quantity) {
        const remainingQuantity = product.quantity - (existingItem?.quantity || 0);
        if (remainingQuantity <= 0) {
          return res.status(400).json({ 
            message: `Maximum quantity already in cart` 
          });
        } else {
          return res.status(400).json({ 
            message: `Can only add ${remainingQuantity} more item(s)` 
          });
        }
      }

      if (existingItem) {
        // Update quantity if item exists
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: totalRequestedQuantity },
        });
      } else {
        // Create new cart item
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      // Return updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.json(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Error adding to cart' });
    }
  },

  // Update cart item quantity
  async updateCartItem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity cannot be negative' });
      }

      // Verify cart ownership and get product info
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id,
          cart: {
            userId,
          },
        },
        include: {
          product: true,
        },
      });

      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      // Check product availability
      if (cartItem.product.status !== 'ACTIVE') {
        return res.status(400).json({ message: 'Product is not available' });
      }

      // Check quantity limit
      if (quantity > cartItem.product.quantity) {
        return res.status(400).json({ 
          message: `Only ${cartItem.product.quantity} items available` 
        });
      }

      // If quantity is 0, remove item
      if (quantity === 0) {
        await prisma.cartItem.delete({
          where: { id },
        });
      } else {
        // Update item quantity
        await prisma.cartItem.update({
          where: { id },
          data: { quantity },
        });
      }

      // Return updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.json(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Error updating cart item' });
    }
  },

  // Remove item from cart
  async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;

      // Verify cart ownership
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id,
          cart: {
            userId,
          },
        },
      });

      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      // Delete item
      await prisma.cartItem.delete({
        where: { id },
      });

      // Return updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.json(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Error removing from cart' });
    }
  },

  // Clear cart (optional feature)
  async clearCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Error clearing cart' });
    }
  },
};