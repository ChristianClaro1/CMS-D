import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { db } from './database/connection';
import { logger } from './utils/logger';
import authMiddleware from './middleware/auth';
import rbacMiddleware from './middleware/rbac';
import errorHandler from './middleware/errorHandler';
import cacheMiddleware from './middleware/cache';
import validationMiddleware from './middleware/validation';
import auditMiddleware from './middleware/audit';

// Import routes
import healthRoutes from './routes/health';
import courseRoutes from './routes/courses';
import instructorRoutes from './routes/instructors';
import pricingRoutes from './routes/pricing';
import prerequisiteRoutes from './routes/prerequisites';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token?.startsWith('service-')) return config.rateLimit.maxServiceRequests;
    if (token?.startsWith('admin-')) return config.rateLimit.maxAdminRequests;
    return config.rateLimit.maxStudentRequests;
  },
  message: {
    code: 429,
    message: 'Too many requests. Please slow down and retry after 60 seconds.',
    retry_after: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no auth required)
app.use('/health', healthRoutes);

// API routes with authentication and RBAC
app.use('/api/v1/courses', authMiddleware, rbacMiddleware, auditMiddleware, cacheMiddleware, courseRoutes);
app.use('/api/v1/instructors', authMiddleware, rbacMiddleware, auditMiddleware, instructorRoutes);
app.use('/api/v1/pricing', authMiddleware, rbacMiddleware, auditMiddleware, pricingRoutes);
app.use('/api/v1/prerequisites', authMiddleware, rbacMiddleware, auditMiddleware, prerequisiteRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

const PORT = config.server.port;

app.listen(PORT, () => {
  logger.info(`CMS Server running on port ${PORT}`);
  logger.info(`Environment: ${config.server.nodeEnv}`);
});

export default app;
