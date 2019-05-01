exports.up = function(knex, Promise) {
  return knex.schema.createTable('plan_person', (table) => {
    table.integer('person_id');
    table.integer('plan_id');
    table.primary(['person_id', 'plan_id']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('plan_person');
};
