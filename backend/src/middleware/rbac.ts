import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

interface RolePermissions {
  [role: string]: string[];
}

const ROLE_PERMISSIONS: RolePermissions = {
  'Curriculum Committee': ['POST /courses', 'GET /courses/*'],
  'Department Chair': ['PATCH /courses/*/instructor', 'GET /courses/*'],
  'Registrar': ['PATCH /courses/*/sections', 'GET /courses/*'],
  'Admin': ['*'], // Full access
  'Service': ['GET /courses/*'], // Subsystem service accounts
  'Student': ['GET /courses/catalog', 'GET /courses/*/prerequisites', 'GET /courses/*/pricing'],
};

export const rbacMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      code: 401,
      message: 'Authentication required.',
    });
    return;
  }

  const userRole = req.user.role;
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];

  const requestedPath = req.path;
  const requestedMethod = req.method;
  const fullPath = `${requestedMethod} ${requestedPath}`;

  // Check if user has wildcard permission
  if (userPermissions.includes('*')) {
    next();
    return;
  }

  // Check for exact match or pattern match
  const hasPermission = userPermissions.some(permission => {
    if (permission === fullPath) return true;
    
    // Handle wildcards in permissions
    if (permission.includes('*')) {
      const regex = new RegExp(
        '^' + permission.replace(/\*/g, '.*').replace(/\//g, '\\/') + '$'
      );
      return regex.test(fullPath);
    }
    
    return false;
  });

  if (!hasPermission) {
    res.status(403).json({
      code: 403,
      message: 'Unauthorized access attempt.',
    });
    return;
  }

  next();
};
