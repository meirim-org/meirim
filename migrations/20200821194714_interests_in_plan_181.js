
exports.up = async function(knex) {
    await knex.schema.createTableIfNotExists("tables_18_interests_in_plan", t => {
        t.increments("id").primary();
        t.integer("plan_id").notNullable().references('id').inTable('plan');
        t.string("origin", 10);  // 1.8.1 or 1.8.2 or 1.8.3
        t.string("profession", 300);
        t.string("type", 300);
        t.string("description", 300);
        t.string("name", 300);
        t.string("license_number", 300);
        t.string("corporate", 300);
        t.string("city", 300);
        t.string("street", 300);
        t.string("house", 300);
        t.string("phone", 300);
        t.string("fax", 300);
        t.string("email", 300);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('tables_18_interests_in_plan');
};
