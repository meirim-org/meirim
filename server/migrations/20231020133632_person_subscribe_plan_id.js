exports.up = function (knex) {
    return knex.schema.table('person', (table) => {
        table.integer('subscribe_plan_id');
    });
};

exports.down = function (knex) {
    return knex.schema.table('person', (table) => {
        table.dropColumns('subscribe_plan_id');
    });
};
