/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('instructor_assignments', function(table) {
    table.string('assignment_id', 20).primary().comment('System-generated');
    table.string('course_id', 20).notNullable().comment('Linked course');
    table.string('instructor_id', 20).notNullable().comment('Assigned instructor');
    table.string('section', 10).notNullable().comment('e.g., A, B, C');
    table.string('schedule', 50).nullable().comment('e.g., MWF 08:00-09:00');
    table.string('room', 50).nullable().comment('Assigned room');
    table.string('semester', 20).notNullable().comment('Semester of assignment');
    table.timestamp('assigned_at').notNullable().defaultTo(knex.fn.now()).comment('When assignment was made');
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now()).comment('Last modification time');
    
    // Foreign key constraints
    table.foreign('course_id').references('course_id').inTable('courses').onDelete('CASCADE');
    table.foreign('instructor_id').references('instructor_id').inTable('instructors').onDelete('CASCADE');
    
    // Unique constraint: (course_id, section, semester)
    table.unique(['course_id', 'section', 'semester'], 'uq_instructor_assignments_course_section_semester');
    
    // Indexes for performance
    table.index(['instructor_id'], 'idx_instructor_assignments_instructor');
    table.index(['semester'], 'idx_instructor_assignments_semester');
    table.index(['course_id'], 'idx_instructor_assignments_course');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('instructor_assignments');
};
