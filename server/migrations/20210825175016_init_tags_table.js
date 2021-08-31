
exports.up = async function(knex) {

    await knex.table('plan_tag').del();

    await knex.raw('ALTER TABLE tag DROP FOREIGN KEY tag_parent_id_foreign');
    await knex.raw('ALTER TABLE tag DROP COLUMN parent_id');

    await knex.schema.table('tag', table => {
        table.integer('parent_id')
            .unsigned()
            .references('id')
            .inTable('tag')
            .onDelete('set null');
    });

    const tbl = knex.table('tag');
    // remove everything from the table
    await tbl.del();

};

exports.down = async function(knex) {
    const tbl = knex.table('tag');
    
};
