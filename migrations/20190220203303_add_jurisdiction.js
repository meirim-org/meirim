exports.up = function(knex, Promise) {
  return knex.schema.table("plan", (table) => {
    table.text("jurisdiction");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("plan", (table) => {
    table.dropColumns("jurisdiction");
  });
};
