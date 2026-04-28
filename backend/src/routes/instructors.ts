import { Router } from 'express';
import { db } from '../database/connection';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Mock instructor data for development
const mockInstructors = [
  {
    instructor_id: 'INST-2024-0001',
    first_name: 'Maria',
    last_name: 'Santos',
    email: 'maria.santos@university.edu',
    specialization: 'Computer Science',
    status: 'Active',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-04-10T14:20:00Z',
  },
  {
    instructor_id: 'INST-2024-0002',
    first_name: 'Juan',
    last_name: 'Reyes',
    email: 'juan.reyes@university.edu',
    specialization: 'Software Engineering',
    status: 'Active',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-03-20T11:45:00Z',
  },
];

// GET /instructors - Retrieve instructor list
router.get('/', authMiddleware, async (req, res) => {
  try {
    const instructors = await db('instructors')
      .select('*')
      .orderBy('last_name', 'asc');

    res.json({
      semester: '2024-2025-1',
      total: instructors.length,
      instructors: instructors,
    });
  } catch (error) {
    logger.error('Error fetching instructors:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
});

// GET /instructors/:id/courses - Get courses for specific instructor
router.get('/:id/courses', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const instructor = await db('instructors')
      .where('instructor_id', id)
      .first();

    if (!instructor) {
      return res.status(404).json({
        code: 404,
        message: 'Instructor not found',
      });
    }

    const courses = await db('instructor_assignments')
      .join('courses', 'courses.course_id', '=', 'instructor_assignments.instructor_id', '=', id)
      .join('courses', 'courses.course_id', '=', 'instructor_assignments.course_id')
      .select(
        'courses.course_id',
        'courses.course_code',
        'courses.course_name',
        'courses.course_type',
        'courses.units',
        'courses.section',
        'courses.semester',
        'courses.schedule',
        'courses.room'
      );

    res.json({
      instructor_id: id,
      instructor_name: `${instructor.first_name} ${instructor.last_name}`,
      courses: courses,
    });
  } catch (error) {
    logger.error('Error fetching instructor courses:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
});

export default router;
