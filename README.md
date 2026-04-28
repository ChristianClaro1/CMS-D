# Course Management Subsystem (CMS)

## Overview
The Course Management Subsystem (CMS) is the central hub for course content within the Intelligent Academic Ecosystem (IAE). It serves as the single source of truth for all course-related information, including course creation, instructor assignments, pricing, prerequisites, and enrollment management.

## Key Features
- **Course Management**: Create, update, and archive courses with full lifecycle management
- **Instructor Assignments**: Manage instructor-to-course section assignments
- **Pricing Management**: Set and update course pricing with lab fee support
- **Prerequisite Management**: Handle complex prerequisite and co-requisite relationships
- **Real-time Updates**: Integration with SRM for live enrollment tracking
- **Event-driven Architecture**: Kafka-based event publishing to notify other subsystems
- **Role-based Access Control**: Comprehensive RBAC with JWT authentication
- **Audit Logging**: Complete audit trail for all system changes

## Technology Stack
- **Frontend**: React.js + TypeScript, Tailwind CSS, Hero UI, Vite
- **Backend**: Node.js + Express.js (REST API)
- **Database**: PostgreSQL with Redis caching
- **Messaging**: Kafka for event publishing
- **Integration**: REST API calls to other subsystems, ESB integration

## Architecture
- Event-driven for outbound notifications
- Request-response for inbound queries
- Horizontal scalability with load balancer support
- Database read replicas for GET endpoints
- Redis caching with 5-minute TTL

## Security
- JWT authentication with 15-minute access tokens
- Role-based access control (RBAC)
- Rate limiting per token type
- HTTPS-only with CORS policy
- Input validation and SQL injection prevention
- AES-256 encryption for sensitive data at rest

## Performance Requirements
- Course catalog response within 500ms for up to 500 courses
- Kafka event delivery within 2 seconds
- Slot availability updates within 1 second
- 99.9% uptime during enrollment periods
- Support for 500+ concurrent users

## Team Members
- Christian A. Claro
- Sean Michael V. De Castro
- David James B. Ignacio
- Ashley Kyla D. Vinzon