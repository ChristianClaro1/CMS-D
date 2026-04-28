import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

interface ErrorResponse {
  code: number;
  message: string;
  error?: string;
  errors?: Record<string, string>;
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Default error response
  let statusCode = 500;
  let errorResponse: ErrorResponse = {
    code: 500,
    message: 'Internal server error',
  };

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorResponse = {
      code: 400,
      message: 'Validation error',
      errors: (error as any).errors || {},
    };
  } else if (error.name === 'CastError') {
    statusCode = 400;
    errorResponse = {
      code: 400,
      message: 'Invalid data format',
    };
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    errorResponse = {
      code: 401,
      message: 'Unauthorized access',
    };
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    errorResponse = {
      code: 403,
      message: 'Forbidden access',
    };
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    errorResponse = {
      code: 404,
      message: 'Resource not found',
    };
  } else if (error.name === 'ConflictError') {
    statusCode = 409;
    errorResponse = {
      code: 409,
      message: 'Resource conflict',
    };
  }

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = error.message;
  }

  res.status(statusCode).json(errorResponse);
};

export class ValidationError extends Error {
  public errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden access') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}
