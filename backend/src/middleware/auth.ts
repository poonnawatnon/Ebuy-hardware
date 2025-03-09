// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      }
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    req.user = { id: decoded.userId };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof JsonWebTokenError) {
      // Handle invalid token format
      return res.status(403).json({ 
        message: 'Invalid token format',
        error: error.message 
      });
    }
    
    if (error instanceof TokenExpiredError) {
      // Handle expired token
      return res.status(401).json({ 
        message: 'Token expired',
        error: error.message 
      });
    }
    
    if (error instanceof NotBeforeError) {
      // Handle token that's not active yet
      return res.status(403).json({ 
        message: 'Token not active',
        error: error.message 
      });
    }
    
    // Handle any other types of errors
    return res.status(403).json({ 
      message: 'Authentication error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};