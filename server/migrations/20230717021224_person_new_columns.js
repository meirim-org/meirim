exports.up = function (knex) {
  return knex.schema.table("person", (table) => {
    table.text("facebook");
    table.text("linkedin");
    table.text("twitter");
    table.integer("photo_id").notNullable().unsigned();
    table.foreign("photo_id").references("person_photo.id");
  });
};

exports.down = function (knex) {
  return knex.schema.table("plan", (table) => {
    table.dropColumns("facebook", "linkedin", "twitter", "photo_id");
  });
};
