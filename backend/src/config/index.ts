import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '8000'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'cms_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'cms-service',
    topics: {
      courseUpdated: process.env.KAFKA_TOPIC_COURSE_UPDATED || 'cms.course.updated',
      slotUpdated: process.env.KAFKA_TOPIC_SLOT_UPDATED || 'cms.slot.updated',
      pricingUpdated: process.env.KAFKA_TOPIC_PRICING_UPDATED || 'cms.pricing.updated',
    },
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    maxAdminRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_ADMIN || '300'),
    maxServiceRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_SERVICE || '600'),
    maxStudentRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_STUDENT || '60'),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  externalServices: {
    srmApiUrl: process.env.SRM_API_URL || 'http://localhost:3003',
    studentRecordsApiUrl: process.env.STUDENT_RECORDS_API_URL || 'http://localhost:3004',
  },
};
