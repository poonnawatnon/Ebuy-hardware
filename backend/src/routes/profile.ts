import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/profile';

const router = express.Router();

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);

export default router;