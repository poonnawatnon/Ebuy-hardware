import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, orderController.getBuyerOrders);
router.get('/:id', authenticateToken, orderController.getOrder);
router.get('/seller', authenticateToken, orderController.getSellerOrders);
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus);
router.get('/seller/orders', authenticateToken, orderController.getSellerOrders);

export default router;