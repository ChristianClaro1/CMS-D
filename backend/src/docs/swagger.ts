import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Management System API',
      version: '1.0.0',
      description: 'RESTful API for Course Management Subsystem (CMS) - Single source of truth for course content, instructor assignments, and pricing across the Intelligent Academic Ecosystem',
      contact: {
        name: 'API Support',
        email: 'api-support@academic-ecosystem.edu',
      },
      servers: [
        {
          url: 'https://api.academic-ecosystem.edu/v1',
          description: 'Production server',
        },
        {
          url: 'http://localhost:8000/api/v1',
          description: 'Development server',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Course: {
          type: 'object',
          required: ['course_code', 'course_name', 'course_type', 'units', 'price', 'section_capacity', 'semester'],
          properties: {
            course_id: {
              type: 'string',
              description: 'Unique course identifier',
              example: 'CRS-2024-0001',
            },
            course_code: {
              type: 'string',
              description: 'Course code (e.g., CS101)',
              example: 'CS101',
              minLength: 3,
              maxLength: 20,
            },
            course_name: {
              type: 'string',
              description: 'Full course name',
              example: 'Introduction to Computer Science',
              minLength: 5,
              maxLength: 255,
            },
            course_type: {
              type: 'string',
              enum: ['Lecture', 'Lab'],
              description: 'Type of course',
              example: 'Lecture',
            },
            units: {
              type: 'integer',
              minimum: 1,
              maximum: 10,
              description: 'Number of academic units',
              example: 3,
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Course price in PHP',
              example: 15000,
            },
            section_capacity: {
              type: 'integer',
              minimum: 1,
              maximum: 500,
              description: 'Maximum students per section',
              example: 40,
            },
            instructor_id: {
              type: 'string',
              description: 'Assigned instructor ID',
              example: 'INST-2024-0001',
            },
            prerequisites: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of prerequisite course codes',
              example: ['CS100'],
            },
            is_elective: {
              type: 'boolean',
              description: 'Whether course is an elective',
              example: false,
            },
            semester: {
              type: 'string',
              description: 'Academic semester',
              example: '2024-2025-1',
            },
            status: {
              type: 'string',
              enum: ['draft', 'active', 'archived'],
              description: 'Course status',
              example: 'active',
            },
          },
        },
        InstructorAssignment: {
          type: 'object',
          required: ['instructor_id', 'section'],
          properties: {
            instructor_id: {
              type: 'string',
              description: 'Instructor ID',
              example: 'INST-2024-0001',
            },
            section: {
              type: 'string',
              description: 'Section identifier',
              example: 'A',
            },
          },
        },
        SectionUpdate: {
          type: 'object',
          required: ['section'],
          properties: {
            section: {
              type: 'string',
              description: 'Section identifier',
              example: 'A',
            },
            section_capacity: {
              type: 'integer',
              minimum: 1,
              maximum: 500,
              description: 'Maximum students per section',
              example: 45,
            },
            room: {
              type: 'string',
              description: 'Assigned room',
              example: 'Room 301',
            },
            schedule: {
              type: 'string',
              description: 'Class schedule',
              example: 'MWF 10:00-11:30',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              description: 'Error code',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'object',
              description: 'Validation errors (if applicable)',
            },
          },
        },
      },
    },
    apis: {
      '/courses': {
        get: {
          tags: ['Courses'],
          summary: 'Get course catalog',
          description: 'Retrieve paginated course catalog with filtering options',
          parameters: [
            {
              name: 'semester',
              in: 'query',
              schema: {
                type: 'string',
                description: 'Filter by semester',
              },
            },
            {
              name: 'status',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['active', 'draft', 'archived'],
                description: 'Filter by status',
              },
            },
            {
              name: 'page',
              in: 'query',
              schema: {
                type: 'integer',
                minimum: 1,
                default: 1,
                description: 'Page number',
              },
            },
            {
              name: 'limit',
              in: 'query',
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 20,
                description: 'Items per page',
              },
            },
          ],
          responses: {
            200: {
              description: 'Course catalog retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      semester: { type: 'string' },
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      courses: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Course',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Courses'],
          summary: 'Create new course',
          description: 'Create a new course with pricing and prerequisites',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Course',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Course created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Course',
                  },
                },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/courses/{id}/instructor': {
        patch: {
          tags: ['Courses'],
          summary: 'Assign instructor to course',
          description: 'Assign an instructor to a specific course section',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'Course ID',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/InstructorAssignment',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Instructor assigned successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      course_id: { type: 'string' },
                      section: { type: 'string' },
                      instructor_id: { type: 'string' },
                      assignment_confirmed: { type: 'boolean' },
                      updated_at: { type: 'string' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Course not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/courses/{id}/sections': {
        patch: {
          tags: ['Courses'],
          summary: 'Update course section',
          description: 'Update course section details',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'Course ID',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SectionUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Section updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      course_id: { type: 'string' },
                      section: { type: 'string' },
                      section_capacity: { type: 'integer' },
                      room: { type: 'string' },
                      schedule: { type: 'string' },
                      updated_at: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs.json', swaggerUi.setup(specs));
  
  // Custom CSS for Swagger UI
  app.use('/api-docs', swaggerUi.setup(specs, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .scheme-container { margin: 20px 0 }
    `,
    customSiteTitle: 'CMS API Documentation',
  }));
};

export default specs;
