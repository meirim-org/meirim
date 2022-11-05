
exports.up = function(knex) {
    return knex.schema.table('plan', table => {
        // some default time
        table.dateTime('last_tags_update').notNullable().defaultTo('2000-01-01 00:00:01');
    })
};

exports.down = function(knex) {
    return knex.schema.table('plan', table => {
        table.dropColumns(
            'last_tags_update'
        );
    });
};
