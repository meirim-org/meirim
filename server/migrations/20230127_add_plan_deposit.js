exports.up = function(knex) {
    return knex.schema.table('plan', table => {
      table.boolean('was_deposited').default('false');
    });
  };

exports.down = async function(knex) {
    await knex.schema.table('plan', table => {
        table.dropColumns('was_deposited');
    });
};