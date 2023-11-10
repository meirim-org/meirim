exports.up = function (knex) {
    return knex.schema.table('person', (table) => {
        table.boolean('is_reached_max_alerts');
    });
};

exports.down = function (knex) {
    return knex.schema.table('person', (table) => {
        table.dropColumns('is_reached_max_alerts');
    });
};
