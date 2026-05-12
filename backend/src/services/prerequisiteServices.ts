import { prisma } from "../utils/db";

function normalizeDependencyCodes(codes?: string[]) {
  return [...new Set(codes ?? [])];
}

function normalizeDependencyPayload(prerequisites?: string[], corequisites?: string[]) {
  const uniquePrerequisites = normalizeDependencyCodes(prerequisites);
  const uniqueCorequisites = normalizeDependencyCodes(corequisites).filter((code) => !uniquePrerequisites.includes(code));

  return {
    prerequisites: uniquePrerequisites,
    corequisites: uniqueCorequisites,
  };
}

export async function getPrerequisites(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { course_id: courseId },
    include: {
      prerequisites: { include: { required_course: true } },
    },
  });

  if (!course) return null;

  const prerequisiteMap = new Map<string, { course_code: string; course_name: string; type: string }>();
  const corequisiteMap = new Map<string, { course_code: string; course_name: string; type: string }>();

  for (const prerequisite of course.prerequisites) {
    const item = {
      course_code: prerequisite.required_course.course_code,
      course_name: prerequisite.required_course.course_name,
      type: prerequisite.requirement_type,
    };

    if (prerequisite.requirement_type === "prerequisite") {
      prerequisiteMap.set(item.course_code, item);
    }

    if (prerequisite.requirement_type === "corequisite") {
      corequisiteMap.set(item.course_code, item);
    }
  }

  const prerequisites = [...prerequisiteMap.values()];
  const corequisites = [...corequisiteMap.values()];

  return { course, prerequisites, corequisites };
}

export async function updatePrerequisites(courseId: string, data: any) {
  const course = await prisma.course.findUnique({ where: { course_id: courseId } });
  if (!course) return null;

  const normalized = normalizeDependencyPayload(data.prerequisites, data.corequisites);

  if (normalized.prerequisites.includes(course.course_code)) {
    throw new Error(`${course.course_code} cannot be its own prerequisite.`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.prerequisite.deleteMany({ where: { course_id: courseId } });

    if (normalized.prerequisites.length) {
      const prereqCourses = await tx.course.findMany({
        where: { course_code: { in: normalized.prerequisites } },
        select: { course_id: true, course_code: true },
      });
      const prereqMap = new Map(prereqCourses.map((c) => [c.course_code, c.course_id]));
      for (const code of normalized.prerequisites) {
        const reqId = prereqMap.get(code);
        if (reqId) {
          await tx.prerequisite.create({
            data: { course_id: courseId, required_course_id: reqId, requirement_type: "prerequisite" },
          });
        }
      }
    }

    if (normalized.corequisites.length) {
      const coreqCourses = await tx.course.findMany({
        where: { course_code: { in: normalized.corequisites } },
        select: { course_id: true, course_code: true },
      });
      const coreqMap = new Map(coreqCourses.map((c) => [c.course_code, c.course_id]));
      for (const code of normalized.corequisites) {
        const reqId = coreqMap.get(code);
        if (reqId) {
          await tx.prerequisite.create({
            data: { course_id: courseId, required_course_id: reqId, requirement_type: "corequisite" },
          });
        }
      }
    }
  });

  return true;
}
