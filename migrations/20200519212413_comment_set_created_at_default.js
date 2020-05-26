exports.up = function(knex, Promise) {
    // update null created_at comments to have min date (so there's a value
    // but it is easily distinguishable)
    return knex('comment').whereNull('created_at').update({
        created_at: 0
    }).then(() =>
        knex.schema.alterTable('comment', table => {
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()).alter();
        })
    );
};
  
exports.down = function(knex, Promise) {
    return knex.schema.alterTable('comment', table => {
        table.timestamp('created_at').nullable().defaultTo(null).alter();
    });
};
