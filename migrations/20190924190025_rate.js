exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("rate", t => {
        t.increments("id").primary();
        t.integer("score").notNullable();
        t.integer("person_id").notNullable();
        t.integer("plan_id").notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.unique(['person_id', 'plan_id']);
    }).then(()=>{
        return knex.schema.alterTable('plan', function(t) {
            t.float('rating').notNullable().defaultTo(0);           
          });
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("rate").then(()=>{
        return knex.schema.table('plan', table => {
            table.dropColumns(
                'rating'
                );
            });
        })
    };
