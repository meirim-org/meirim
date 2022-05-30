exports.up = function(knex) {
    return knex.schema.table('plan', table => {
        table.text('AGAM_ID');
        table.text('plan_new_mavat_url');
    });
};

exports.down = function(knex) {
    return knex.schema.table('plan', table => {
        table.dropColumns(
            'AGAM_ID',
            'plan_new_mavat_url',
        );
    });
};
