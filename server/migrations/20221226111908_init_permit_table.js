
exports.up = function(knex) {
    return knex.schema
    .hasTable()
    .createTable('permit', table => {
      table.increments('id').primary();
      table.string('subject').notNullable();
      table.timestamp('permit_created_at').notNullable();
      table.string('region').notNullable();
      table.string('real_estate');
      table.string('author');
      table.string('status');
      table.string('timeline'); // Won't really be here, just playing with it.
      table.string('importance'); // Won't really be here, just playing with it.
    })
    .catch((error) => {
        console.error("Permit table already exists, error is:", error)
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('permit');
};
