exports.up =	async function(knex)	{	
	await knex.schema.table('tag', table => {
		table.integer('parent_id')
		.unsigned()
		.references('id')
		.inTable('tag');
		table.string('display_name');
		table.integer('score');
		table.boolean('is_super_tag');
		table.boolean('is_stand_alone');
		table.string('display_tooltip');
	});

	await knex.schema.createTable('plan_tag', table => {
		table.increments('id').primary();
		table.integer('tag_id')
		.unsigned()
		.references('id')
		.inTable('tag');
		table.integer('plan_id')
		.references('id')
		.inTable('plan');	 
		table.integer('display_score')
		.default(1);
		table.string('created_by_data_rules');
		table.boolean('created_by_child').default('false');
		table.boolean('child_is_stand_alone').default('false');
		table.datetime('creation_date').defaultTo(knex.fn.now());
	 })	

	
	};
	
	
	exports.down = async function(knex) {
	await knex.schema.table('tag', table => {
		table.dropForeign('parent_id');
		table.dropColumns(
			'parent_id',
			'display_name',
			'score',
			'is_super_tag',
			'is_stand_alone',
			'display_tooltip');
	});

	await knex.schema.dropTableIfExists('plan_tag');
};