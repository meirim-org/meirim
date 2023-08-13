exports.up = function (knex) {
  return knex.schema
    .createTableIfNotExists("person_photo", (table) => {
      table.increments("id").primary();
      table.string("url").notNullable();
      table.integer("person_id").notNullable().unsigned();
      table.foreign("person_id").references("person.id");
    })
    .catch((error) => {
      console.error("Person photo table already exists, error is:", error);
    });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("person_photo");
};
