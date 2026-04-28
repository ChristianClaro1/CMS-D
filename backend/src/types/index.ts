export interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  course_type: 'Lecture' | 'Lab';
  units: number;
  semester: string;
  classification: 'Core' | 'Elective' | 'Major';
  status: 'Draft' | 'Active' | 'Archived';
  instructor_id?: string;
  section_capacity: number;
  enrolled_count: number;
  room_requirement?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Instructor {
  instructor_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department?: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  created_at: Date;
  updated_at: Date;
}

export interface CoursePricing {
  pricing_id: string;
  course_id: string;
  base_fee: number;
  lab_fee?: number;
  currency: string;
  effective_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Prerequisite {
  id: number;
  course_id: string;
  required_course_id: string;
  requirement_type: 'prerequisite' | 'corequisite';
  created_at: Date;
  updated_at: Date;
}

export interface InstructorAssignment {
  assignment_id: string;
  course_id: string;
  instructor_id: string;
  section: string;
  schedule?: string;
  room?: string;
  semester: string;
  assigned_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  log_id: number;
  user_id: string;
  user_role: string;
  action: string;
  course_id?: string;
  changed_fields?: Record<string, any>;
  ip_address?: string;
  performed_at: Date;
}

export interface JWTPayload {
  user_id: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export interface CourseCatalogResponse {
  semester: string;
  total: number;
  page: number;
  limit: number;
  courses: Course[];
}

export interface InstructorAssignmentResponse {
  semester: string;
  assignments: Array<{
    instructor_id: string;
    instructor_name: string;
    courses: Array<{
      course_id: string;
      course_code: string;
      section: string;
      schedule?: string;
      room?: string;
    }>;
  }>;
}

export interface PrerequisiteGraphResponse {
  course_id: string;
  course_code: string;
  prerequisites: Array<{
    course_code: string;
    course_name: string;
    type: 'prerequisite' | 'corequisite';
  }>;
  corequisites: Array<{
    course_code: string;
    course_name: string;
    type: 'prerequisite' | 'corequisite';
  }>;
  prerequisite_graph_valid: boolean;
}

export interface PricingResponse {
  course_id: string;
  course_code: string;
  course_name: string;
  price: number;
  currency: string;
  units: number;
  price_per_unit: number;
  semester: string;
  effective_date: string;
}

export interface KafkaEvent {
  event: string;
  timestamp: string;
  course_id: string;
  course_code: string;
  semester: string;
  change_type: 'create' | 'update' | 'archive';
  changed_fields?: string[];
  updated_data?: Record<string, any>;
}
