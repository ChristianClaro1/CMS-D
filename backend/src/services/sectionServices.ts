import { prisma } from "../utils/db";

type SectionInput = {
  section: string;
  section_capacity: number;
  room?: string;
  schedule?: string;
};

function normalizeSection(value: string) {
  return value.trim().toUpperCase();
}

async function hydrateSection(section: any) {
  if (!section) return null;

  const assignment = await prisma.instructorAssignment.findFirst({
    where: {
      course_id: section.course_id,
      section: section.section,
      semester: section.semester,
    },
    include: { instructor: true },
  });

  return {
    section_id: section.section_id,
    course_id: section.course_id,
    course_code: section.course.course_code,
    course_name: section.course.course_name,
    semester: section.semester,
    status: section.course.status,
    section: section.section,
    section_capacity: section.section_capacity,
    enrolled_count: section.enrolled_count,
    available_slots: Math.max(section.section_capacity - section.enrolled_count, 0),
    room_requirement: section.room ?? section.course.room_requirement ?? null,
    room: section.room ?? null,
    schedule: section.schedule ?? null,
    instructor_name: assignment?.instructor?.instructor_name ?? "TBA",
  };
}

export async function listSections(courseId?: string) {
  const sections = await prisma.section.findMany({
    where: courseId ? { course_id: courseId } : undefined,
    include: { course: true },
    orderBy: [{ semester: "desc" }, { section: "asc" }],
  });

  const hydrated = await Promise.all(sections.map((section) => hydrateSection(section)));
  return hydrated.filter((section): section is NonNullable<typeof section> => section !== null);
}

export async function createSection(courseId: string, data: SectionInput) {
  const course = await prisma.course.findUnique({ where: { course_id: courseId } });
  if (!course) return null;

  const section = normalizeSection(data.section);
  const existing = await prisma.section.findUnique({
    where: {
      course_id_section_semester: {
        course_id: courseId,
        section,
        semester: course.semester,
      },
    },
  });

  if (existing) {
    throw new Error("Section already exists for this course and semester.");
  }

  const created = await prisma.section.create({
    data: {
      course_id: courseId,
      section,
      section_capacity: data.section_capacity,
      enrolled_count: 0,
      room: data.room || null,
      schedule: data.schedule || null,
      semester: course.semester,
    },
    include: { course: true },
  });

  return hydrateSection(created);
}

export async function updateSection(courseId: string, sectionId: string, data: SectionInput) {
  const section = await prisma.section.findFirst({
    where: { section_id: sectionId, course_id: courseId },
    include: { course: true },
  });

  if (!section) return null;

  const nextSection = normalizeSection(data.section);

  if (section.enrolled_count > data.section_capacity) {
    throw new Error("New capacity cannot be less than current enrolled count.");
  }

  const duplicate = await prisma.section.findFirst({
    where: {
      course_id: courseId,
      section: nextSection,
      semester: section.semester,
      section_id: { not: sectionId },
    },
  });

  if (duplicate) {
    throw new Error("Section already exists for this course and semester.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.section.update({
      where: { section_id: sectionId },
      data: {
        section: nextSection,
        section_capacity: data.section_capacity,
        room: data.room || null,
        schedule: data.schedule || null,
      },
      include: { course: true },
    });

    await tx.instructorAssignment.updateMany({
      where: { course_id: courseId, section: section.section, semester: section.semester },
      data: { section: nextSection, room: data.room || null, schedule: data.schedule || null },
    });

    return next;
  });

  return hydrateSection(updated);
}

export async function deleteSection(courseId: string, sectionId: string) {
  const section = await prisma.section.findFirst({
    where: { section_id: sectionId, course_id: courseId },
    include: { course: true },
  });

  if (!section) return null;

  await prisma.$transaction(async (tx) => {
    await tx.instructorAssignment.deleteMany({
      where: {
        course_id: courseId,
        section: section.section,
        semester: section.semester,
      },
    });

    await tx.section.delete({ where: { section_id: sectionId } });
  });

  return section;
}
