import { Request, Response, NextFunction } from 'express';
import Redis from 'redis';
import { config } from '@/config';
import { logger } from '@/utils/logger';

let redisClient: Redis.RedisClientType;

const initializeRedis = async (): Promise<void> => {
  try {
    redisClient = Redis.createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password || undefined,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
  }
};

// Initialize Redis on module load
initializeRedis();

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Only cache GET requests to course catalog
  if (req.method !== 'GET' || !req.path.includes('/catalog')) {
    next();
    return;
  }

  const cacheKey = `course_catalog:${JSON.stringify(req.query)}`;
  
  try {
    if (redisClient?.isOpen) {
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        res.set('X-Cache', 'HIT');
        res.json(JSON.parse(cachedData));
        return;
      }
    }
  } catch (error) {
    logger.error('Cache retrieval error:', error);
  }

  // Store original res.json to cache the response
  const originalJson = res.json;
  res.json = function(data: any) {
    // Cache the response for 5 minutes (300 seconds)
    if (redisClient?.isOpen && res.statusCode === 200) {
      redisClient.setEx(cacheKey, 300, JSON.stringify(data)).catch((error) => {
        logger.error('Cache storage error:', error);
      });
    }
    
    res.set('X-Cache', 'MISS');
    return originalJson.call(this, data);
  };

  next();
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  try {
    if (redisClient?.isOpen) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        logger.info(`Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
      }
    }
  } catch (error) {
    logger.error('Cache invalidation error:', error);
  }
};

export const clearCourseCatalogCache = (): Promise<void> => {
  return invalidateCache('course_catalog:*');
};
