import { Router } from 'express';
import { addressController } from '../controllers/addressController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, addressController.createAddress);

export default router;