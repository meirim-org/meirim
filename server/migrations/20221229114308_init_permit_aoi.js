
exports.up = function(knex) {
    return knex.schema
    .hasTable()
    .createTable('permit_aoi', table => {
      table.increments('id').primary();
      table.enu('type', ['region', 'other']).notNullable().default('other');
      table.string('name').notNullable();
      table.specificType('geom', 'GEOMETRY').notNullable();
      table.enu('visibility', ['public', 'private']).notNullable().default('public');
      table.string('url');
      table.timestamps(true, true, false);
    })
    .catch((error) => {
        console.error("Permit AOI table already exists, error is:", error)
    })
    
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('permit_aoi');
};
