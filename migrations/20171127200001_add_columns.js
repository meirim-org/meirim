exports.up = function(knex, Promise) {
  return knex.schema.table('plan', table => {
    table.text('plan_url');
    table.text('goals_from_mavat');
    table.text('main_details_from_mavat');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('plan', table => {
    table.dropColumns(
      'plan_url',
      'goals_from_mavat',
      'main_details_from_mavat',
    );
  });
};
