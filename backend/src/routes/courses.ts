import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/database/connection';
import { 
  validateRequest, 
  courseCreationSchema, 
  instructorAssignmentSchema, 
  sectionUpdateSchema,
  querySchema 
} from '@/middleware/validation';
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError 
} from '@/middleware/errorHandler';
import { clearCourseCatalogCache } from '@/middleware/cache';
import { AuthenticatedRequest } from '@/middleware/auth';
import { logger } from '@/utils/logger';

const router = Router();

// POST /courses - Create new course
router.post('/', validateRequest(courseCreationSchema), async (req: AuthenticatedRequest, res: Response) => {
  const trx = await db.transaction();
  
  try {
    const {
      course_code,
      course_name,
      course_type,
      units,
      price,
      section_capacity,
      instructor_id,
      prerequisites = [],
      is_elective = false,
      semester,
      status = 'draft'
    } = req.body;

    // Check for duplicate course in same semester
    const existingCourse = await trx('courses')
      .where({ course_code, semester })
      .first();

    if (existingCourse) {
      throw new ConflictError('Course with this code already exists in the specified semester');
    }

    // Generate course ID
    const course_id = `CRS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Determine classification based on is_elective
    const classification = is_elective ? 'Elective' : 'Core';

    // Create course
    const [course] = await trx('courses').insert({
      course_id,
      course_code,
      course_name,
      course_type,
      units,
      semester,
      classification,
      status,
      instructor_id: instructor_id || null,
      section_capacity,
      enrolled_count: 0,
      room_requirement: null,
    }).returning('*');

    // Create pricing record
    const pricing_id = `PRC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    await trx('course_pricing').insert({
      pricing_id,
      course_id,
      base_fee: price,
      lab_fee: course_type === 'Lab' ? price * 0.3 : null,
      currency: 'PHP',
      effective_date: new Date(),
    });

    // Add prerequisites if provided
    if (prerequisites.length > 0) {
      const prerequisiteRecords = prerequisites.map((required_course_id: string) => ({
        course_id,
        required_course_id,
        requirement_type: 'prerequisite',
      }));

      await trx('prerequisites').insert(prerequisiteRecords);
    }

    await trx.commit();
    await clearCourseCatalogCache();

    res.status(201).json({
      course_id,
      course_code,
      course_name,
      course_type,
      units,
      price,
      section_capacity,
      instructor_id,
      prerequisites,
      is_elective,
      semester,
      status,
      created_at: course.created_at,
    });

  } catch (error) {
    await trx.rollback();
    logger.error('Course creation error:', error);
    throw error;
  }
});

// GET /courses/catalog - Get course catalog
router.get('/catalog', async (req: Request, res: Response) => {
  try {
    const { semester, status = 'active', page = 1, limit = 20 } = querySchema.parse(req.query);
    
    const offset = (page - 1) * limit;

    let query = db('courses')
      .select(
        'courses.*',
        'course_pricing.base_fee as price',
        'instructors.first_name',
        'instructors.last_name'
      )
      .leftJoin('course_pricing', 'courses.course_id', 'course_pricing.course_id')
      .leftJoin('instructors', 'courses.instructor_id', 'instructors.instructor_id')
      .where('courses.status', status);

    if (semester) {
      query = query.where('courses.semester', semester);
    }

    const courses = await query
      .orderBy('courses.course_code')
      .limit(limit)
      .offset(offset);

    // Get prerequisites for each course
    const coursesWithPrereqs = await Promise.all(
      courses.map(async (course: any) => {
        const prerequisites = await db('prerequisites')
          .join('courses as req', 'prerequisites.required_course_id', 'req.course_id')
          .where('prerequisites.course_id', course.course_id)
          .where('prerequisites.requirement_type', 'prerequisite')
          .select('req.course_code', 'req.course_name');

        return {
          ...course,
          instructor_name: course.first_name && course.last_name 
            ? `${course.first_name} ${course.last_name}` 
            : null,
          prerequisites: prerequisites.map((p: any) => p.course_code),
          is_elective: course.classification === 'Elective',
        };
      })
    );

    // Get total count for pagination
    const totalCount = await db('courses')
      .where('courses.status', status)
      .modify(function(queryBuilder: any) {
        if (semester) {
          queryBuilder.where('courses.semester', semester);
        }
      })
      .count('* as total')
      .first();

    res.json({
      semester: semester || 'current',
      total: parseInt(totalCount?.total || '0'),
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      courses: coursesWithPrereqs,
    });

  } catch (error) {
    logger.error('Course catalog error:', error);
    throw error;
  }
});

// PATCH /courses/:id/instructor - Assign instructor to course
router.patch('/:id/instructor', validateRequest(instructorAssignmentSchema), async (req: AuthenticatedRequest, res: Response) => {
  const trx = await db.transaction();
  
  try {
    const { id } = req.params;
    const { instructor_id, section } = req.body;

    // Check if course exists
    const course = await trx('courses').where({ course_id: id }).first();
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if instructor exists
    const instructor = await trx('instructors').where({ instructor_id }).first();
    if (!instructor) {
      throw new ValidationError('Invalid instructor assignment', { instructor_id: 'Instructor not found' });
    }

    // Create instructor assignment
    const assignment_id = `ASN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    await trx('instructor_assignments').insert({
      assignment_id,
      course_id: id,
      instructor_id,
      section,
      semester: course.semester,
    });

    // Update course with instructor
    await trx('courses')
      .where({ course_id: id })
      .update({ instructor_id, updated_at: new Date() });

    await trx.commit();
    await clearCourseCatalogCache();

    res.json({
      course_id: id,
      section,
      instructor_id,
      assignment_confirmed: true,
      updated_at: new Date().toISOString(),
    });

  } catch (error) {
    await trx.rollback();
    logger.error('Instructor assignment error:', error);
    throw error;
  }
});

// PATCH /courses/:id/sections - Update course section
router.patch('/:id/sections', validateRequest(sectionUpdateSchema), async (req: AuthenticatedRequest, res: Response) => {
  const trx = await db.transaction();
  
  try {
    const { id } = req.params;
    const { section, section_capacity, room, schedule } = req.body;

    // Check if course exists
    const course = await trx('courses').where({ course_id: id }).first();
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Update instructor assignment if room or schedule provided
    if (room || schedule) {
      await trx('instructor_assignments')
        .where({ course_id: id, section })
        .update({
          ...(room && { room }),
          ...(schedule && { schedule }),
          updated_at: new Date(),
        });
    }

    // Update course capacity if provided
    if (section_capacity) {
      await trx('courses')
        .where({ course_id: id })
        .update({ 
          section_capacity, 
          updated_at: new Date() 
        });
    }

    await trx.commit();
    await clearCourseCatalogCache();

    res.json({
      course_id: id,
      section,
      section_capacity: section_capacity || course.section_capacity,
      room: room || null,
      schedule: schedule || null,
      updated_at: new Date().toISOString(),
    });

  } catch (error) {
    await trx.rollback();
    logger.error('Section update error:', error);
    throw error;
  }
});

export default router;
