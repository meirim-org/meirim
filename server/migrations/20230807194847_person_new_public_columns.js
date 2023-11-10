exports.up = function (knex) {
  return knex.schema.table("person", (table) => {
    table.text("about_me_public");
    table.text("email_public");
    table.text("title");
  });
};

exports.down = function (knex) {
  return knex.schema.table("person", (table) => {
    table.dropColumns("about_me_public", "email_public", "title");
  });
};
