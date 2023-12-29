exports.up = function (knex) {
    return knex.schema.table('person', (table) => {
        table.integer('subscribe_plan_id');
        table.boolean('is_reached_max_alerts');
        table.boolean('is_subscription_canceled');
    });
};

exports.down = function (knex) {
    return knex.schema.table('person', (table) => {
        table.dropColumns('subscribe_plan_id');
        table.dropColumns('is_reached_max_alerts');
        table.dropColumns('is_subscription_canceled');
    });
};
