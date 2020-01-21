
exports.up = function(knex) {
  // creating the new cols for the plans
  return knex.schema.table('plan', table => {
    table.integer('num_of_comments');
  });

  // to existing plans - updating existing data

//   .catch(trx.rollback);
};

exports.down = function(knex) {
  // removing the new cols from the plans
  return knex.schema.table('plan', table => {
    table.dropColumns(
      'num_of_comments'
    );
  });
};
