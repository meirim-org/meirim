const CommentPersonStruct = function(table) {
	table.increments();
	table.integer('comment_id');
	table.integer('person_id');
	table.timestamps();
	return table;
};

module.exports = CommentPersonStruct;