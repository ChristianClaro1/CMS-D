import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { db } from '@/database/connection';
import { logger } from '@/utils/logger';

export const auditMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Only audit mutating requests
  if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    next();
    return;
  }

  // Store original res.json to intercept responses
  const originalJson = res.json;
  let responseData: any;

  res.json = function(data: any) {
    responseData = data;
    return originalJson.call(this, data);
  };

  // Continue to next middleware
  res.on('finish', async () => {
    try {
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        const action = getActionFromRequest(req);
        const courseId = getCourseIdFromRequest(req);
        const changedFields = getChangedFields(req, responseData);

        await db('audit_logs').insert({
          user_id: req.user.user_id,
          user_role: req.user.role,
          action,
          course_id: courseId,
          changed_fields: changedFields,
          ip_address: req.ip,
          performed_at: new Date(),
        });

        logger.info('Audit log created', {
          action,
          user_id: req.user.user_id,
          user_role: req.user.role,
          course_id: courseId,
          ip: req.ip,
        });
      }
    } catch (error) {
      logger.error('Failed to create audit log:', error);
    }
  });

  next();
};

function getActionFromRequest(req: Request): string {
  const method = req.method;
  const path = req.path;
  
  if (method === 'POST' && path.includes('/courses')) {
    return 'COURSE_CREATED';
  }
  if (method === 'PATCH' && path.includes('/instructor')) {
    return 'INSTRUCTOR_ASSIGNED';
  }
  if (method === 'PATCH' && path.includes('/sections')) {
    return 'SECTION_UPDATED';
  }
  if (method === 'PUT' && path.includes('/prerequisites')) {
    return 'PREREQUISITES_UPDATED';
  }
  if (method === 'PATCH' && path.includes('/pricing')) {
    return 'PRICING_UPDATED';
  }
  if (method === 'DELETE' && path.includes('/courses')) {
    return 'COURSE_DELETED';
  }
  
  return `${method}_${path.replace(/\//g, '_').toUpperCase()}`;
}

function getCourseIdFromRequest(req: Request): string | undefined {
  // Extract course_id from URL parameters or request body
  if (req.params.id) return req.params.id;
  if (req.body.course_id) return req.body.course_id;
  if (req.body.course_id) return req.body.course_id;
  
  return undefined;
}

function getChangedFields(req: Request, responseData: any): Record<string, any> | undefined {
  const changedFields: Record<string, any> = {};
  
  // For PATCH requests, track what was changed
  if (req.method === 'PATCH' && req.body) {
    Object.keys(req.body).forEach(key => {
      if (key !== 'course_id') {
        changedFields[key] = {
          old: undefined, // Would need to fetch from DB for old value
          new: req.body[key],
        };
      }
    });
  }
  
  // For POST requests, track all fields
  if (req.method === 'POST' && req.body) {
    Object.keys(req.body).forEach(key => {
      changedFields[key] = {
        old: undefined,
        new: req.body[key],
      };
    });
  }
  
  return Object.keys(changedFields).length > 0 ? changedFields : undefined;
}
