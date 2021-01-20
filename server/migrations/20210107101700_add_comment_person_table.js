exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('comment_person', table => {
      table.increments('id').primary();
      table.integer('comment_id');
      table.integer('person_id');
      table.timestamps();
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comment_person');
};
