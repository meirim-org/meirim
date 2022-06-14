const Chart17Struct = function(t) {
	t.increments();
	t.integer('plan_id');
	t.text('kind', 65535);
	t.text('contains', 65535);
	t.text('scale', 65535);
	t.text('number_of_pages', 65535);
	t.text('edit_date', 65535);  //data is in string form, we can't assume that it will be a nice integer
	t.text('editor', 65535);
	t.text('creation_date', 65535);
	t.text('description', 65535);
	t.text('included', 65535);
	return t;
};

module.exports = Chart17Struct;