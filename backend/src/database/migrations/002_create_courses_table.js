/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('courses', function(table) {
    table.string('course_id', 20).primary().comment('System-generated unique ID (e.g., CRS-2024-0001)');
    table.string('course_code', 20).notNullable().comment('e.g., CS101');
    table.string('course_name', 255).notNullable().comment('Full course title');
    table.enum('course_type', ['Lecture', 'Lab']).notNullable().comment('Section type');
    table.integer('units').notNullable().checkPositive().comment('Number of academic units');
    table.string('semester', 20).notNullable().comment('e.g., 2024-2025-1');
    table.enum('classification', ['Core', 'Elective', 'Major']).notNullable().comment('Curriculum category');
    table.enum('status', ['Draft', 'Active', 'Archived']).notNullable().defaultTo('Draft').comment('Lifecycle status');
    table.string('instructor_id', 20).nullable().comment('Assigned instructor');
    table.integer('section_capacity').notNullable().checkPositive().comment('Maximum students allowed');
    table.integer('enrolled_count').notNullable().defaultTo(0).checkNonNegative().comment('Updated by SRM in real time');
    table.string('room_requirement', 50).nullable().comment('Preferred or required room');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()).comment('Record creation time');
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now()).comment('Last modification time');
    
    // Foreign key constraint
    table.foreign('instructor_id').references('instructor_id').inTable('instructors').onDelete('SET NULL');
    
    // Unique constraint: (course_code, semester)
    table.unique(['course_code', 'semester'], 'uq_courses_code_semester');
    
    // Indexes for performance
    table.index(['course_code'], 'idx_courses_code');
    table.index(['semester'], 'idx_courses_semester');
    table.index(['status'], 'idx_courses_status');
    table.index(['instructor_id'], 'idx_courses_instructor');
    table.index(['classification'], 'idx_courses_classification');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('courses');
};
