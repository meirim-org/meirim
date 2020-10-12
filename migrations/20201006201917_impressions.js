exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExists("impression", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable();
        t.integer("ip").notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
    }).then(() => {
        return knex.schema.alterTable('plan', function (t) {
            t.integer('views').defaultTo(0);
            t.integer('erosion_views').defaultTo(0);
        });
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("impression")
        .then(() => knex.schema.table('plan', t => {
            t.dropColumns('views', 'erosion_views')
        }))
};
