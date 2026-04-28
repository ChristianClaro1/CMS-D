import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from './errorHandler';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
  course_code: Joi.string().required().min(3).max(20),
  course_name: Joi.string().required().min(5).max(255),
  course_type: Joi.string().valid('Lecture', 'Lab').required(),
  units: Joi.number().integer().min(1).max(10).required(),
  price: Joi.number().positive().required(),
  section_capacity: Joi.number().integer().min(1).max(500).required(),
  instructor_id: Joi.string().optional(),
  prerequisites: Joi.array().items(Joi.string()).optional(),
  is_elective: Joi.boolean().optional(),
  semester: Joi.string().required(),
  status: Joi.string().valid('draft', 'active', 'archived').default('draft'),
});

const instructorAssignmentSchema = Joi.object({
  instructor_id: Joi.string().required(),
  section: Joi.string().required(),
});

const sectionUpdateSchema = Joi.object({
  section: Joi.string().required(),
  section_capacity: Joi.number().integer().min(1).max(500).optional(),
  room: Joi.string().optional(),
  schedule: Joi.string().optional(),
});

const prerequisitesSchema = Joi.object({
  prerequisites: Joi.array().items(Joi.string()).optional(),
  corequisites: Joi.array().items(Joi.string()).optional(),
});

const pricingSchema = Joi.object({
  course_id: Joi.string().required(),
  base_fee: Joi.number().positive().required(),
  lab_fee: Joi.number().min(0).optional(),
  currency: Joi.string().default('PHP'),
  effective_date: Joi.date().required(),
});

const querySchema = Joi.object({
  semester: Joi.string().optional(),
  status: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const validateRequest = (schemaName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let schema;
    
    switch (schemaName) {
      case 'createCourse':
        schema = courseSchema;
        break;
      case 'assignInstructor':
        schema = instructorAssignmentSchema;
        break;
      case 'updateSection':
        schema = sectionUpdateSchema;
        break;
      case 'setPrerequisites':
        schema = prerequisitesSchema;
        break;
      case 'createPricing':
        schema = pricingSchema;
        break;
      case 'query':
        schema = querySchema;
        break;
      default:
        return next();
    }

    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        code: 400,
        message: 'Validation error',
        errors: error.details,
      });
    }

    req.body = value;
    next();
  };
};
