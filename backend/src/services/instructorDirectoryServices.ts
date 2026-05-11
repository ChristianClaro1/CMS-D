import { prisma } from "../utils/db";

export async function searchInstructors(query: string = "", limit: number = 25) {
  const trimmedQuery = query.trim();
  const where = trimmedQuery
    ? {
        OR: [
          { instructor_name: { contains: trimmedQuery, mode: "insensitive" as const } },
          { email: { contains: trimmedQuery, mode: "insensitive" as const } },
          { department: { contains: trimmedQuery, mode: "insensitive" as const } },
        ],
      }
    : {};

  const instructors = await prisma.instructor.findMany({
    where,
    take: limit,
    orderBy: { updated_at: "desc" },
    include: {
      assignments: {
        include: {
          course: true,
        },
        orderBy: { assigned_at: "desc" },
      },
    },
  });

  return instructors.map((instructor) => ({
    instructor_id: instructor.instructor_id,
    instructor_name: instructor.instructor_name,
    email: instructor.email,
    department: instructor.department,
    assignment_count: instructor.assignments.length,
    courses: instructor.assignments.map((assignment) => ({
      course_id: assignment.course_id,
      course_code: assignment.course.course_code,
      course_name: assignment.course.course_name,
      section: assignment.section,
      semester: assignment.semester,
      schedule: assignment.schedule,
      room: assignment.room,
    })),
    created_at: instructor.created_at.toISOString(),
    updated_at: instructor.updated_at.toISOString(),
  }));
}

export async function createInstructor(data: {
  instructor_name: string;
  email: string;
  department?: string | null;
}) {
  return prisma.instructor.create({
    data: {
      instructor_name: data.instructor_name,
      email: data.email,
      department: data.department || null,
    },
  });
}

export async function updateInstructor(
  instructorId: string,
  data: {
    instructor_name: string;
    email: string;
    department?: string | null;
  }
) {
  return prisma.instructor.update({
    where: { instructor_id: instructorId },
    data: {
      instructor_name: data.instructor_name,
      email: data.email,
      department: data.department || null,
    },
  });
}

export async function deleteInstructor(instructorId: string) {
  return prisma.instructor.delete({
    where: { instructor_id: instructorId },
  });
}