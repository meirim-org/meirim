exports.up = function(knex, Promise) {
    return knex.schema
      .createTableIfNotExists('objection', table => {
        table.increments('id').primary();
        table.integer('tree_permit_id').notNullable();
        table.text('content');
        table.string('url', 2500).notNullable();
        table.boolean('email_sent').default('false');
        table.datetime('last_objection_date').notNullable();
        table.timestamps();
      });
    };
    
    exports.down = function(knex, Promise) {
      return knex.schema
        .dropTableIfExists('objection');
    };
    