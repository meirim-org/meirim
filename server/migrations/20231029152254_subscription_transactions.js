exports.up = function (knex) {
  return knex.schema.createTable('subscription_transactions', table => {
    table.integer('yaad_id').primary();
    table.integer('hk_id');
    table.integer('person_id');
    table.integer('amount').notNullable();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('subscription_transactions');
};
