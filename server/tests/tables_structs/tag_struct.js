const TagStruct = function(table) {
    table.increments('id').primary();
    table.string('name');
    table.integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('tag');
    table.string('display_name');
    table.integer('score');
    table.boolean('is_super_tag');
    table.boolean('is_stand_alone');
    table.string('display_tooltip');
    return table;
};

module.exports = TagStruct;