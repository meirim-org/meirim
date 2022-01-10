const Chart71Struct = function(t) {
	t.increments();
	t.integer('plan_id');
	t.text('phase', 65535);
	t.text('phase_description', 65535);
	t.text('conditioning', 65535);
	return t;
};

module.exports = Chart71Struct;