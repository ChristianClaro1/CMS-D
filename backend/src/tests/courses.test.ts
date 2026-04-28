import request from 'supertest';
import { db } from '@/database/connection';
import { app } from '@/server';
import { kafkaService } from '@/services/kafka';

describe('Courses API', () => {
  beforeEach(async () => {
    // Clean database before each test
    await db('courses').del();
    await db('instructors').del();
    await db('course_pricing').del();
    await db('prerequisites').del();
    await db('instructor_assignments').del();
  });

  afterAll(async () => {
    // Clean up after all tests
    await db.destroy();
  });

  describe('POST /courses', () => {
    it('should create a new course successfully', async () => {
      // First create an instructor
      const [instructor] = await db('instructors')
        .insert({
          instructor_id: 'INST-TEST-001',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@test.com',
          status: 'Active',
        })
        .returning('*');

      const courseData = {
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        course_type: 'Lecture',
        units: 3,
        price: 15000,
        section_capacity: 40,
        instructor_id: instructor.instructor_id,
        prerequisites: [],
        is_elective: false,
        semester: '2024-2025-1',
        status: 'active',
      };

      const response = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', 'Bearer valid-jwt-token')
        .send(courseData)
        .expect(201);

      expect(response.body).toHaveProperty('course_id');
      expect(response.body.course_code).toBe(courseData.course_code);
      expect(response.body.course_name).toBe(courseData.course_name);
    });

    it('should return 400 for invalid course data', async () => {
      const invalidData = {
        course_code: '', // Invalid: empty course code
        course_name: 'Test Course',
        course_type: 'Lecture',
        units: 3,
        price: 15000,
        section_capacity: 40,
        semester: '2024-2025-1',
      };

      const response = await request(app)
        .post('/api/v1/courses')
        .set('Authorization', 'Bearer valid-jwt-token')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 without authentication', async () => {
      const courseData = {
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        course_type: 'Lecture',
        units: 3,
        price: 15000,
        section_capacity: 40,
        semester: '2024-2025-1',
      };

      await request(app)
        .post('/api/v1/courses')
        .send(courseData)
        .expect(401);
    });
  });

  describe('GET /courses/catalog', () => {
    beforeEach(async () => {
      // Insert test data
      const [instructor] = await db('instructors')
        .insert({
          instructor_id: 'INST-TEST-001',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@test.com',
          status: 'Active',
        })
        .returning('*');

      await db('courses').insert({
        course_id: 'CRS-TEST-001',
        course_code: 'CS101',
        course_name: 'Test Course',
        course_type: 'Lecture',
        units: 3,
        semester: '2024-2025-1',
        classification: 'Core',
        status: 'active',
        instructor_id: instructor.instructor_id,
        section_capacity: 40,
        enrolled_count: 25,
      });

      await db('course_pricing').insert({
        pricing_id: 'PRC-TEST-001',
        course_id: 'CRS-TEST-001',
        base_fee: 15000,
        currency: 'PHP',
        effective_date: new Date(),
      });
    });

    it('should return course catalog successfully', async () => {
      const response = await request(app)
        .get('/api/v1/courses/catalog')
        .expect(200);

      expect(response.body).toHaveProperty('courses');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.courses)).toBe(true);
      expect(response.body.courses.length).toBeGreaterThan(0);
    });

    it('should filter by semester', async () => {
      const response = await request(app)
        .get('/api/v1/courses/catalog?semester=2024-2025-1')
        .expect(200);

      expect(response.body.courses[0].semester).toBe('2024-2025-1');
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/v1/courses/catalog?status=active')
        .expect(200);

      response.body.courses.forEach((course: any) => {
        expect(course.status).toBe('active');
      });
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/v1/courses/catalog?page=1&limit=10')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });
  });

  describe('PATCH /courses/:id/instructor', () => {
    beforeEach(async () => {
      // Insert test course and instructor
      await db('instructors').insert({
        instructor_id: 'INST-TEST-001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        status: 'Active',
      });

      await db('courses').insert({
        course_id: 'CRS-TEST-001',
        course_code: 'CS101',
        course_name: 'Test Course',
        course_type: 'Lecture',
        units: 3,
        semester: '2024-2025-1',
        classification: 'Core',
        status: 'active',
        section_capacity: 40,
        enrolled_count: 25,
      });
    });

    it('should assign instructor to course successfully', async () => {
      const assignmentData = {
        instructor_id: 'INST-TEST-001',
        section: 'A',
      };

      const response = await request(app)
        .patch('/api/v1/courses/CRS-TEST-001/instructor')
        .set('Authorization', 'Bearer valid-jwt-token')
        .send(assignmentData)
        .expect(200);

      expect(response.body.course_id).toBe('CRS-TEST-001');
      expect(response.body.section).toBe('A');
      expect(response.body.instructor_id).toBe('INST-TEST-001');
      expect(response.body.assignment_confirmed).toBe(true);
    });

    it('should return 404 for non-existent course', async () => {
      const assignmentData = {
        instructor_id: 'INST-TEST-001',
        section: 'A',
      };

      await request(app)
        .patch('/api/v1/courses/NON-EXISTENT/instructor')
        .set('Authorization', 'Bearer valid-jwt-token')
        .send(assignmentData)
        .expect(404);
    });
  });

  describe('Kafka Integration', () => {
    let publishEventSpy: jest.SpyInstance;

    beforeEach(() => {
      publishEventSpy = jest.spyOn(kafkaService, 'publishEvent');
    });

    afterEach(() => {
      publishEventSpy.mockRestore();
    });

    it('should publish course updated event on course creation', async () => {
      const courseData = {
        course_code: 'CS102',
        course_name: 'Advanced Computer Science',
        course_type: 'Lecture',
        units: 4,
        price: 20000,
        section_capacity: 35,
        semester: '2024-2025-1',
        status: 'active',
      };

      await request(app)
        .post('/api/v1/courses')
        .set('Authorization', 'Bearer valid-jwt-token')
        .send(courseData)
        .expect(201);

      // Verify Kafka event was published
      expect(publishEventSpy).toHaveBeenCalledWith(
        'cms.course.updated',
        expect.any(Object),
        expect.any(String)
      );
    });
  });
});
