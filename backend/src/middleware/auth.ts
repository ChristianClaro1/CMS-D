import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { JWTPayload } from '@/types';
import { logger } from '@/utils/logger';

interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        code: 401,
        message: 'Missing valid credentials.',
      });
      return;
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      res.status(401).json({
        code: 401,
        message: 'Missing valid credentials.',
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          code: 401,
          message: 'Token expired. Please refresh your session.',
        });
        return;
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          code: 401,
          message: 'Invalid token.',
        });
        return;
      }

      logger.error('JWT verification error:', error);
      res.status(401).json({
        code: 401,
        message: 'Authentication failed.',
      });
      return;
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error.',
    });
  }
};

export { AuthenticatedRequest };
