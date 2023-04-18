exports.up = function(knex) {
    return knex.schema.table('alert', table => {
      table.boolean('subscription').notNullable().default(true);
    }).then(() => {
        return knex.raw('UPDATE alert SET subscription = 1');
    });
  };

exports.down = async function(knex) {
    await knex.schema.table('alert', table => {
        table.dropColumns('subscription');
    });
};