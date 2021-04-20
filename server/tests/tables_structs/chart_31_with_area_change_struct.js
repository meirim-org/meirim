const Chart31WithAreaChangeStruct = function(t) {
	t.increments();
	t.integer('plan_id');
	t.text('tasrit_marking', 65535);
	t.text('designation', 65535);
	t.text('cells', 65535);
	return t;
};

module.exports = Chart31WithAreaChangeStruct;