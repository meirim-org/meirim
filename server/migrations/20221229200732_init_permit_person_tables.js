
exports.up = async function(knex) {
    await knex.schema
    .hasTable()
    .createTable('permit_person', table => {
        table.increments('id').primary();
        table.integer('permit_id').notNullable().unsigned();
        table.foreign('permit_id').references('permit.id')
        table.integer('person_id').notNullable().unsigned();
        table.foreign('person_id').references('person.id')
        table.timestamps(true, true, false);
    })
    .catch((error) => {
        console.error("Permit Person table already exists, error is:", error)
    })
    await knex.schema
    .hasTable()
    .createTable('permit_aoi_person', table => {    
        table.increments('id').primary();
        table.integer('permit_aoi_id').notNullable().unsigned();
        table.foreign('permit_aoi_id').references('permit_aoi.id')
        table.integer('person_id').notNullable().unsigned();
        table.foreign('person_id').references('person.id')
        table.timestamps(true, true, false);
    })
    .catch((error) => {
        console.error("Permit AOI Person table already exists, error is:", error)
    })
    
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('permit_aoi_person')
    .dropTableIfExists('permit_person');
};
