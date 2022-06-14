const Chart31WithoutAreaChangeStruct = function(t) {
	t.increments();
	t.integer('plan_id');
	t.text('designation', 65535);
	t.text('field_cells', 65535);
	return t;
};

module.exports = Chart31WithoutAreaChangeStruct;