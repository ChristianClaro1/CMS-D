import { Request, Response, NextFunction } from "express";
import { createSectionSchema, updateSectionSchema } from "../validators/sectionValidator";
import { createSection as createSectionRecord, deleteSection as deleteSectionRecord, listSections as listSectionRecords, updateSection as updateSectionRecord } from "../../../services/sectionServices";
import { logAudit } from "../../../services/auditLogServices";
import { successResponse, commonErrors } from "../../../utils/response";

export async function listSections(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.id as string | undefined;
    const sections = await listSectionRecords(courseId);
    return successResponse(res, { sections });
  } catch (error) {
    next(error);
  }
}

export async function createSection(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.id as string;
    const data = createSectionSchema.parse(req.body);

    const created = await createSectionRecord(courseId, data);
    if (!created) {
      return commonErrors.notFound(res, "Course not found.");
    }

    await logAudit(
      req.user!.userId,
      req.user!.role,
      "SECTION_CREATED",
      courseId,
      { section: created.section, section_capacity: created.section_capacity, room: created.room, schedule: created.schedule },
      req.ip || undefined
    );

    return successResponse(res, created, 201);
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      return commonErrors.conflict(res, error.message);
    }
    next(error);
  }
}

export async function updateSection(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.id as string;
    const sectionId = req.params.sectionId as string;
    const data = updateSectionSchema.parse(req.body);

    const updated = await updateSectionRecord(courseId, sectionId, data);
    if (!updated) {
      return commonErrors.notFound(res, "Section not found.");
    }

    await logAudit(
      req.user!.userId,
      req.user!.role,
      "SECTION_UPDATED",
      courseId,
      { section: data.section, section_capacity: data.section_capacity, room: data.room, schedule: data.schedule },
      req.ip || undefined
    );

    return successResponse(res, {
      section_id: updated.section_id,
      course_id: courseId,
      section: data.section,
      section_capacity: data.section_capacity,
      room: data.room,
      schedule: data.schedule,
      updated_at: updated.updated_at.toISOString(),
    });
  } catch (error: any) {
    if (error.message?.includes("cannot be less")) {
      return commonErrors.unprocessable(res, error.message);
    }
    next(error);
  }
}

export async function deleteSection(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.id as string;
    const sectionId = req.params.sectionId as string;
    const deleted = await deleteSectionRecord(courseId, sectionId);

    if (!deleted) {
      return commonErrors.notFound(res, "Section not found.");
    }

    await logAudit(
      req.user!.userId,
      req.user!.role,
      "SECTION_DELETED",
      courseId,
      { section: deleted.section, section_capacity: deleted.section_capacity, room: deleted.room, schedule: deleted.schedule },
      req.ip || undefined
    );

    return successResponse(res, { section_id: sectionId, message: "Section deleted successfully." });
  } catch (error) {
    next(error);
  }
}
