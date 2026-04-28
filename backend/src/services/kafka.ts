import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { config } from '@/config';
import { logger } from '@/utils/logger';

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private isConnected: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
      ssl: config.kafka.ssl,
      sasl: config.kafka.sasl ? {
        mechanism: 'plain',
        username: config.kafka.sasl.username,
        password: config.kafka.sasl.password,
      } : undefined,
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.isConnected = true;
      logger.info('Kafka producer connected successfully');
    } catch (error) {
      logger.error('Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.isConnected = false;
      logger.info('Kafka producer disconnected');
    } catch (error) {
      logger.error('Error disconnecting Kafka producer:', error);
    }
  }

  async publishEvent(topic: string, event: any, key?: string): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Kafka producer not connected, attempting to reconnect...');
      await this.connect();
    }

    try {
      const record: ProducerRecord = {
        topic,
        messages: [{
          key: key || null,
          value: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
            service: 'cms-api',
            version: '1.0.0',
          }),
          headers: {
            'content-type': 'application/json',
            'event-source': 'cms-api',
          },
        }],
      };

      await this.producer.send(record);
      logger.info(`Event published to topic ${topic}:`, { eventId: event.eventId, key });
    } catch (error) {
      logger.error(`Failed to publish event to topic ${topic}:`, error);
      throw error;
    }
  }

  async publishCourseUpdated(courseData: any): Promise<void> {
    const event = {
      eventId: `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType: 'course.updated',
      data: {
        course_id: courseData.course_id,
        course_code: courseData.course_code,
        course_name: courseData.course_name,
        status: courseData.status,
        instructor_id: courseData.instructor_id,
        section_capacity: courseData.section_capacity,
        enrolled_count: courseData.enrolled_count,
        updated_at: courseData.updated_at,
      },
    };

    await this.publishEvent('cms.course.updated', event, courseData.course_id);
  }

  async publishSlotUpdated(courseId: string, section: string, capacity: number): Promise<void> {
    const event = {
      eventId: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType: 'slot.updated',
      data: {
        course_id: courseId,
        section,
        section_capacity: capacity,
        updated_at: new Date().toISOString(),
      },
    };

    await this.publishEvent('cms.slot.updated', event, `${courseId}-${section}`);
  }

  async publishPricingUpdated(pricingData: any): Promise<void> {
    const event = {
      eventId: `pricing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType: 'pricing.updated',
      data: {
        pricing_id: pricingData.pricing_id,
        course_id: pricingData.course_id,
        base_fee: pricingData.base_fee,
        lab_fee: pricingData.lab_fee,
        currency: pricingData.currency,
        effective_date: pricingData.effective_date,
        updated_at: pricingData.updated_at,
      },
    };

    await this.publishEvent('cms.pricing.updated', event, pricingData.course_id);
  }

  async publishInstructorAssigned(assignmentData: any): Promise<void> {
    const event = {
      eventId: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType: 'instructor.assigned',
      data: {
        assignment_id: assignmentData.assignment_id,
        course_id: assignmentData.course_id,
        instructor_id: assignmentData.instructor_id,
        section: assignmentData.section,
        semester: assignmentData.semester,
        assigned_at: new Date().toISOString(),
      },
    };

    await this.publishEvent('cms.instructor.assigned', event, assignmentData.course_id);
  }
}

export const kafkaService = new KafkaService();

// Initialize connection on startup
kafkaService.connect().catch((error) => {
  logger.error('Failed to initialize Kafka service:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await kafkaService.disconnect();
});

process.on('SIGINT', async () => {
  await kafkaService.disconnect();
});
