exports.up = function (knex) {
  return knex.schema.table('alert', table => {
    table.boolean('disabled');
  });
};

exports.down = function (knex) {
  return knex.schema.table('alert', table => {
    table.dropColumns('disabled');
  });
};
