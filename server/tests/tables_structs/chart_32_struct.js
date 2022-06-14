const Chart32Struct = function(t) {
    t.increments();
    t.integer('plan_id');
    t.text('designation', 65535);
    t.text('size_in_mr', 65535);
    t.text('percentage', 65535);
    t.bool('is_current_state');
    return t;
};

module.exports = Chart32Struct;