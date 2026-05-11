import { Request, Response, NextFunction } from "express";
import { createInstructorSchema, instructorQuerySchema } from "../validators/instructorDirectoryValidator";
import { createInstructor, deleteInstructor, searchInstructors, updateInstructor } from "../../../services/instructorDirectoryServices";
import { successResponse, commonErrors } from "../../../utils/response";

export async function listInstructors(req: Request, res: Response, next: NextFunction) {
  try {
    const query = instructorQuerySchema.parse(req.query);
    const instructors = await searchInstructors(query.query, query.limit);
    return successResponse(res, { total: instructors.length, instructors });
  } catch (error) {
    next(error);
  }
}

export async function addInstructor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createInstructorSchema.parse(req.body);
    const created = await createInstructor(data);

    return successResponse(res, {
      instructor_id: created.instructor_id,
      instructor_name: created.instructor_name,
      email: created.email,
      department: created.department,
      created_at: created.created_at.toISOString(),
      updated_at: created.updated_at.toISOString(),
    }, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return commonErrors.conflict(res, "Instructor email already exists.");
    }
    next(error);
  }
}

export async function editInstructor(req: Request, res: Response, next: NextFunction) {
  try {
    const instructorId = req.params.id as string;
    const data = createInstructorSchema.parse(req.body);
    const updated = await updateInstructor(instructorId, data);

    return successResponse(res, {
      instructor_id: updated.instructor_id,
      instructor_name: updated.instructor_name,
      email: updated.email,
      department: updated.department,
      created_at: updated.created_at.toISOString(),
      updated_at: updated.updated_at.toISOString(),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return commonErrors.notFound(res, "Instructor not found.");
    }
    if (error.code === "P2002") {
      return commonErrors.conflict(res, "Instructor email already exists.");
    }
    next(error);
  }
}

export async function removeInstructor(req: Request, res: Response, next: NextFunction) {
  try {
    const instructorId = req.params.id as string;
    await deleteInstructor(instructorId);
    return successResponse(res, { instructor_id: instructorId, message: "Instructor deleted successfully." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return commonErrors.notFound(res, "Instructor not found.");
    }
    next(error);
  }
}