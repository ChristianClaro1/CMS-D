import { z } from "zod";

export const instructorQuerySchema = z.object({
  query: z.string().trim().optional().default(""),
  limit: z.coerce.number().int().positive().max(100).default(25),
});

export const createInstructorSchema = z.object({
  instructor_name: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(255),
  department: z.string().trim().max(255).optional().or(z.literal("")),
});