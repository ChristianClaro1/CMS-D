import { z } from "zod";

const courseBaseSchema = z.object({
  course_code: z.string().min(1).max(20),
  course_name: z.string().min(1).max(255),
  course_type: z.enum(["Lecture", "Lab"]),
  units: z.number().int().positive(),
  price: z.number().positive(),
  section_capacity: z.number().int().positive(),
  instructor_id: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  corequisites: z.array(z.string()).optional(),
  is_elective: z.boolean().optional(),
  semester: z.string().min(1).max(20),
  status: z.enum(["Draft", "Active", "Archived"]).optional(),
  room_requirement: z.string().max(50).optional(),
});

function validateDependencyLists(
  data: { course_code: string; prerequisites?: string[]; corequisites?: string[] },
  ctx: z.RefinementCtx,
) {
  const prerequisites = data.prerequisites ?? [];
  const corequisites = data.corequisites ?? [];

  if (new Set(prerequisites).size !== prerequisites.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["prerequisites"],
      message: "Prerequisites cannot contain duplicate courses.",
    });
  }

  if (new Set(corequisites).size !== corequisites.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["corequisites"],
      message: "Co-requisites cannot contain duplicate courses.",
    });
  }

  const overlap = prerequisites.filter((code) => corequisites.includes(code));
  if (overlap.length) {
    const duplicateCodes = [...new Set(overlap)].join(", ");
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["prerequisites"],
      message: `The same course cannot be both a prerequisite and a co-requisite: ${duplicateCodes}.`,
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["corequisites"],
      message: `The same course cannot be both a prerequisite and a co-requisite: ${duplicateCodes}.`,
    });
  }
}

export const createCourseSchema = courseBaseSchema.superRefine(validateDependencyLists);

export const updateStatusSchema = z.object({
  status: z.enum(["Draft", "Active", "Archived"]),
});

export const updateCourseSchema = courseBaseSchema.partial().superRefine(validateDependencyLists);

export const catalogQuerySchema = z.object({
  semester: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
