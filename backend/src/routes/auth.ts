import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();
const authController = new AuthController();

// Make sure the controller methods are bound correctly
router.post(
  '/register', 
  validateRegister, 
  (req, res) => authController.register(req, res)
);

router.post(
  '/login', 
  validateLogin, 
  (req, res) => authController.login(req, res)
);

export default router;