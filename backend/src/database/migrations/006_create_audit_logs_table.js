/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('audit_logs', function(table) {
    table.increments('log_id').primary().comment('Auto-incremented');
    table.string('user_id', 20).notNullable().comment('Who performed the action');
    table.string('user_role', 50).notNullable().comment('Role at time of action');
    table.string('action', 50).notNullable().comment('e.g., COURSE_CREATED, INSTRUCTOR_ASSIGNED');
    table.string('course_id', 20).nullable().comment('Affected course if applicable');
    table.jsonb('changed_fields').nullable().comment('Fields that were modified');
    table.string('ip_address', 45).nullable().comment('Request origin IP');
    table.timestamp('performed_at').notNullable().defaultTo(knex.fn.now()).comment('Timestamp of action');
    
    // Foreign key constraint (optional - course might be deleted)
    table.foreign('course_id').references('course_id').inTable('courses').onDelete('SET NULL');
    
    // Indexes for performance
    table.index(['user_id'], 'idx_audit_logs_user');
    table.index(['action'], 'idx_audit_logs_action');
    table.index(['course_id'], 'idx_audit_logs_course');
    table.index(['performed_at'], 'idx_audit_logs_timestamp');
    table.index(['user_role'], 'idx_audit_logs_role');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};
