import { Request, Response, NextFunction } from "express";
import { loginSchema, refreshSchema, signupSchema } from "../validators/authValidator";
import { loginUser, refreshTokens, signupUser } from "../../../services/authServices";
import { successResponse, commonErrors } from "../../../utils/response";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data.email, data.password);
    return successResponse(res, result);
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      return commonErrors.unauthorized(res, "Invalid email or password.");
    }
    next(error);
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const data = signupSchema.parse(req.body);
    const result = await signupUser(data.email, data.password, data.full_name, data.role);
    return successResponse(res, result, 201);
  } catch (error: any) {
    if (error.message === "Email already exists") {
      return commonErrors.conflict(res, "An account with that email already exists.");
    }
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const data = refreshSchema.parse(req.body);
    const result = await refreshTokens(data.refresh_token);
    return successResponse(res, result);
  } catch (error: any) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Refresh token expired or invalid. Please re-authenticate." });
    }
    next(error);
  }
}
