exports.up = function (knex) {
				return knex.schema.table('person', table => {
								table.boolean('is_subscription_canceled');
				});
};

exports.down = function (knex) {
				return knex.schema.table('person', table => {
								table.dropColumns('is_subscription_canceled');
				});
};
