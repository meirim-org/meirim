exports.up = function (knex) {
  return knex.schema
    .createTableIfNotExists("subscription_plans", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("price").notNullable();
      table.string("radius").notNullable();
      table.integer("alerts_qty").notNullable();
      table.string("type").notNullable();
    })
    .catch((error) => {
      console.error(
        "Subscription plans table already exists, error is:",
        error
      );
    });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("subscription_plans");
};
