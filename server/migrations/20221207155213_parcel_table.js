exports.up = function (knex) {
  return knex.schema.createTable("parcel_details", function (table) {
    table.increments("id").primary();
    table.integer("gush_num").notNullable();
    table.integer("parcel");
    // table.geometry("centroid");
    table.specificType("centroid", "GEOMETRY");

    table.string("county_name");
    table.string("region_name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("parcel_details");
};
