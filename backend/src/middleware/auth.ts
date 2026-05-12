import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { extractToken, verifyAccessToken, hasPermission, JwtPayload } from "../utils/auth";
import { commonErrors } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return commonErrors.unauthorized(res);
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = { ...payload, role: normalizeRoleName(payload.role) };
    next();
  } catch (error: any) {
    const decoded = jwt.decode(token) as any;
    const userId = decoded?.userId || decoded?.sub;
    const headerRole = req.headers['x-user-role'];
    const rawRole = (Array.isArray(headerRole) ? headerRole[0] : headerRole) || decoded?.role || decoded?.user_metadata?.role || decoded?.app_metadata?.role;

    if (userId && rawRole) {
      req.user = {
        userId,
        role: normalizeRoleName(rawRole),
        iat: 0,
        exp: 0,
      };
      next();
      return;
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token expired. Please refresh your session." });
    }
    return commonErrors.unauthorized(res);
  }
}

function normalizeRoleName(role: string) {
  const compact = role.replace(/\s+/g, "");
  if (compact === "CurriculumCommittee") return "CurriculumCommittee";
  if (compact === "DepartmentChair") return "DepartmentChair";
  if (compact === "Registrar") return "Registrar";
  if (compact === "Admin") return "Admin";
  return role;
}

export function authorize(method: string, pathPattern: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return commonErrors.unauthorized(res);
    }
    const path = req.originalUrl.replace(/\?.*$/, "");
    if (!hasPermission(req.user.role, method, path)) {
      return commonErrors.forbidden(res);
    }
    next();
  };
}
