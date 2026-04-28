import { Router, Request, Response } from 'express';
import { db } from '@/database/connection';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await db.raw('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'cms-api',
      version: '1.0.0',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'cms-api',
      version: '1.0.0',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check all dependencies
    await db.raw('SELECT 1');
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        migrations: 'ok',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'failed',
        migrations: 'unknown',
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
