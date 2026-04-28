import { Router } from 'express';
import { db } from '../database/connection';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// GET /pricing - Get course pricing information
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { course_id } = req.query;
    
    if (!course_id) {
      return res.status(400).json({
        code: 400,
        message: 'Course ID is required',
      });
    }

    const pricing = await db('course_pricing')
      .where('course_id', course_id)
      .first();

    if (!pricing) {
      return res.status(404).json({
        code: 404,
        message: 'Pricing not found',
      });
    }

    res.json(pricing);
  } catch (error) {
    logger.error('Error fetching pricing:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
});

// POST /pricing - Create or update course pricing
router.post('/', authMiddleware, validateRequest('createPricing'), async (req, res) => {
  try {
    const { course_id, base_fee, lab_fee, currency, effective_date } = req.body;

    // Check if pricing already exists
    const existingPricing = await db('course_pricing')
      .where('course_id', course_id)
      .first();

    const pricingData = {
      course_id,
      base_fee,
      lab_fee: lab_fee || null,
      currency: currency || 'PHP',
      effective_date: effective_date || new Date().toISOString().split('T')[0],
    };

    let pricing;
    if (existingPricing) {
      // Update existing pricing
      [pricing] = await db('course_pricing')
        .where('course_id', course_id)
        .update(pricingData)
        .returning('*');
    } else {
      // Create new pricing
      [pricing] = await db('course_pricing')
        .insert(pricingData)
        .returning('*');
    }

    res.status(201).json(pricing[0]);
  } catch (error) {
    logger.error('Error creating/updating pricing:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
});

export default router;
