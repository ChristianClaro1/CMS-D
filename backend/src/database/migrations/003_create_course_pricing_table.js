/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('course_pricing', function(table) {
    table.string('pricing_id', 20).primary().comment('System-generated');
    table.string('course_id', 20).notNullable().comment('Linked course');
    table.decimal('base_fee', 10, 2).notNullable().checkNonNegative().comment('Tuition per unit or flat');
    table.decimal('lab_fee', 10, 2).nullable().checkNonNegative().comment('Only for Lab-type courses');
    table.string('currency', 5).notNullable().defaultTo('PHP').comment('Currency code');
    table.date('effective_date').notNullable().comment('When pricing takes effect');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()).comment('Record creation time');
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now()).comment('Last modification time');
    
    // Foreign key constraint
    table.foreign('course_id').references('course_id').inTable('courses').onDelete('CASCADE');
    
    // Indexes for performance
    table.index(['course_id'], 'idx_course_pricing_course');
    table.index(['effective_date'], 'idx_course_pricing_effective_date');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('course_pricing');
};
