import { z } from "zod";

const signupRoles = ["Admin", "Curriculum Committee", "Department Chair", "Registrar"] as const;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2).max(120),
  role: z.enum(signupRoles),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1),
});
