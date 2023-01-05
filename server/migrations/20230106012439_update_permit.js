
exports.up = function(knex) {
    return knex.schema.alterTable('permit', table => {
        table.string('url');
        table.timestamp('status_updated_at').defaultTo(knex.fn.now());
        table.timestamps(true, true, false); 
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('permit', table => {
        table.dropColumn('url');
        table.dropColumn('status_updated_at');
        table.dropTimestamps(); 
      })
};
