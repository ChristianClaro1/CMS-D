/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('instructors', function(table) {
    table.string('instructor_id', 20).primary().comment('System-generated unique ID (e.g., INS-00042)');
    table.string('first_name', 100).notNullable().comment('Instructor first name');
    table.string('last_name', 100).notNullable().comment('Instructor last name');
    table.string('email', 255).unique().notNullable().comment('Instructor email address');
    table.string('phone', 20).nullable().comment('Contact phone number');
    table.string('department', 100).nullable().comment('Department affiliation');
    table.enum('status', ['Active', 'Inactive', 'On Leave']).defaultTo('Active').comment('Current status');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()).comment('Record creation time');
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now()).comment('Last modification time');
    
    table.index(['email'], 'idx_instructors_email');
    table.index(['department'], 'idx_instructors_department');
    table.index(['status'], 'idx_instructors_status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('instructors');
};
