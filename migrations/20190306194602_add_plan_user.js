exports.up = function(knex, Promise) {
    return knex.schema.table('plan_person', (table) => {
        table.integer('person_id');
        table.integer('plan_id');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('plan_person', (table) => {
      table.dropColumns('plan_id', 'person_id');
    });
  };