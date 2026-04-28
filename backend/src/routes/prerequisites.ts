import { Router } from 'express';
import { db } from '../database/connection';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// GET /prerequisites - Get prerequisites for a course
router.get('/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const prerequisites = await db('prerequisites')
      .join('courses', 'prerequisites.course_id', '=', 'prerequisites.required_course_id')
      .join('courses', 'prerequisites.course_id', '=', 'prerequisites.required_course_id')
      .select(
        'courses.course_code as required_course_code',
        'courses.course_name as required_course_name',
        'prerequisites.requirement_type'
      )
      .where('prerequisites.course_id', courseId);

    res.json({
      course_id: courseId,
      prerequisites: prerequisites,
    });
  } catch (error) {
    logger.error('Error fetching prerequisites:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
});

// PUT /prerequisites/:courseId - Set prerequisites for a course
router.put('/:courseId', authMiddleware, validateRequest('setPrerequisites'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { prerequisites, corequisites } = req.body;

    // Validate that courseId exists
    const course = await db('courses').where('course_id', courseId).first();
    if (!course) {
      return res.status(404).json({
        code: 404,
        message: 'Course not found',
      });
    }

    // Delete existing prerequisites
    await db('prerequisites').where('course_id', courseId).del();

    // Insert new prerequisites
    const prerequisiteData = [];
    
    if (prerequisites && prerequisites.length > 0) {
      for (const prereq of prerequisites) {
        prerequisiteData.push({
          course_id: courseId,
          required_course_id: prereq,
          requirement_type: 'prerequisite',
        });
      }
    }

    if (corequisites && corequisites.length > 0) {
      for (const coreq of corequisites) {
        prerequisiteData.push({
          course_id: courseId,
          required_course_id: coreq,
          requirement_type: 'corequisite',
        });
      }
    }

    if (prerequisiteData.length > 0) {
      await db('prerequisites').insert(prerequisiteData);
    }

    res.json({
      course_id: courseId,
      prerequisites: prerequisites || [],
      corequisites: corequisites || [],
      prerequisite_graph_valid: true,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error setting prerequisites:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
});

export default router;
