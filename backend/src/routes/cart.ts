import { Router } from 'express';
import { cartController } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All cart routes should be protected
router.use(authenticateToken);

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:id', cartController.updateCartItem);
router.delete('/items/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;