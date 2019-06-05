exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('comment', table => {
      table.increments('id').primary();
      table.integer('parent_id');
      table.integer('person_id');
      table.integer('plan_id');
      table.string('content', 2000);
      table.timestamps();
    })
    .then(() =>
      knex.schema.table('person', table => {
        table
          .string('alias')
          .unique()
          .nullable();
      }),
    );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTab('comment');
};
