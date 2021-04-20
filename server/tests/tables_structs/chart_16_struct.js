const Chart16Struct = function(t) {
	t.increments();
	t.integer('plan_id');
	t.text('prev_plan_number', 65535);
	t.text('kind', 65535);
	t.text('comment', 65535);
	t.text('yalkoot_number', 65535);
	t.text('yalkoot_page_number', 65535);  //data is in string form, we can't assume that it will be a nice integer
	t.text('date', 65535);
	return t;
};

module.exports = Chart16Struct;