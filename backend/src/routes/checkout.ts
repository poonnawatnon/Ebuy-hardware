import { Router } from 'express';
import { checkoutController } from '../controllers/checkoutController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, checkoutController.createOrder);

export default router;