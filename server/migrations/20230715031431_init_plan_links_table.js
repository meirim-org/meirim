exports.up = function (knex) {
  return knex.schema
    .createTableIfNotExists("plan_links", (table) => {
      table.increments("id").primary();
      table.string("url").notNullable();
      table.string("link_title").notNullable();
      table.string("link_type").defaultTo("web");
      table.string("link_description");
      table.integer("plan_id");
    })
    .catch((error) => {
      console.error("Plan Links table already exists, error is:", error);
    });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("plan_links");
};
