const PersonPhotoStruct = function (table) {
	table.increments();
	table.string('url').notNullable();
	table.integer('person_id').notNullable().unsigned();
	table.foreign('person_id').references('person.id');
	return table;
};

module.exports = PersonPhotoStruct;
