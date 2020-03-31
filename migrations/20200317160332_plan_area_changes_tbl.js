
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('plan_area_changes', table => {
            table.increments('changeId').primary();
            table.integer('planId').references('id').inTable('plan');
            table.string('category', 255);
            table.string('unit', 255);
            table.integer('approvedState');
            table.integer('changeToApprovedState');
            table.integer('totalChange');
            table.timestamps();
        })
        .createTable('plan_address', table => {
            table.increments('id').primary();
            table.integer('planId').references('id').inTable('plan');
            table.string('district', 255);
            table.string('space', 255);   //מרחב תכנון
            table.string('localAuthority', 255);
            table.string('settlement', 255);
            table.string('street', 255);
            table.string('houseNumber', 255);
        });
};

exports.down = function(knex) {
  
};
