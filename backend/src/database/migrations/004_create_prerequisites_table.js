/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('prerequisites', function(table) {
    table.increments('id').primary().comment('Auto-incremented');
    table.string('course_id', 20).notNullable().comment('The course requiring this prereq');
    table.string('required_course_id', 20).notNullable().comment('The course that must be completed first');
    table.enum('requirement_type', ['prerequisite', 'corequisite']).notNullable().comment('Type of requirement');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()).comment('Record creation time');
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now()).comment('Last modification time');
    
    // Foreign key constraints
    table.foreign('course_id').references('course_id').inTable('courses').onDelete('CASCADE');
    table.foreign('required_course_id').references('course_id').inTable('courses').onDelete('CASCADE');
    
    // Unique constraint: (course_id, required_course_id, requirement_type)
    table.unique(['course_id', 'required_course_id', 'requirement_type'], 'uq_prerequisites_triplet');
    
    // Check constraint: course_id ≠ required_course_id
    table.check('course_id <> required_course_id', 'ck_prerequisites_no_self_reference');
    
    // Indexes for performance
    table.index(['course_id'], 'idx_prerequisites_course');
    table.index(['required_course_id'], 'idx_prerequisites_required_course');
    table.index(['requirement_type'], 'idx_prerequisites_type');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('prerequisites');
};
