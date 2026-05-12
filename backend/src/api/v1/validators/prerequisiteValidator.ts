import { z } from "zod";

export const updatePrerequisitesSchema = z.object({
  prerequisites: z.array(z.string()).optional(),
  corequisites: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
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
});
