exports.up = function(knex, Promise) {
    return knex.schema.table("plan", table => {
        table.string("areaChanges", 2048);
    });
};

exports.down = function(knex, Promise) {};
