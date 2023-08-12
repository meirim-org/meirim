exports.up = function (knex) {
  return knex.schema.table("plan", (table) => {
    table.text("plan_display_name_arabic");
    table.text("goals_from_mavat_arabic");
    table.text("main_details_from_mavat_arabic");
  });
};

exports.down = function (knex) {
  return knex.schema.table("plan", (table) => {
    table.dropColumns(
      "plan_display_name_arabic",
      "goals_from_mavat_arabic",
      "main_details_from_mavat_arabic"
    );
  });
};
