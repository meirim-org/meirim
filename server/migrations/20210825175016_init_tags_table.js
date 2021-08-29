const housingTag = require('../api/lib/tags/housing');
const publicTag = require('../api/lib/tags/public');
const hotelieryTag = require('../api/lib/tags/hoteliery');
const commerceTag = require('../api/lib/tags/commerce');
const employmentTag = require('../api/lib/tags/employment');

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

	await tbl.insert({name: housingTag.TAG_NAME});
	await tbl.insert({name: publicTag.TAG_NAME});
	await tbl.insert({name: hotelieryTag.TAG_NAME});
	await tbl.insert({name: commerceTag.TAG_NAME});
	await tbl.insert({name: employmentTag.TAG_NAME});

};

exports.down = async function(knex) {
	const tbl = knex.table('tag');

	await tbl.where('name', housingTag.TAG_NAME).del();
	await tbl.where('name', publicTag.TAG_NAME).del();
	await tbl.where('name', hotelieryTag.TAG_NAME).del();
	await tbl.where('name', commerceTag.TAG_NAME).del();
	await tbl.where('name', employmentTag.TAG_NAME).del();
	
};
