import { Router } from 'express';
import ProductController from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', ProductController.getProducts);

// Protected routes - require authentication 
// DO NOT RE-ORDER
router.get('/seller', authenticateToken, ProductController.getSellerProducts);
router.post('/', authenticateToken, ProductController.createProduct);
router.get('/:id', ProductController.getProduct);
router.put('/:id', authenticateToken, ProductController.updateProduct);
router.delete('/:id', authenticateToken, ProductController.deleteProduct);
router.put('/:id/deactivate', authenticateToken, ProductController.deactivateProduct);

export default router;