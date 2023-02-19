const {	meirimStatuses } = require('../api/constants');

exports.up = function(knex) {
    return knex.schema.table('plan', table => {
      table.boolean('was_deposited').default('false');
    }).then(() => {
      return knex.raw('UPDATE plan set was_deposited=true where id in (select distinct p.plan_id from plan_status_change p join status_mapping s on s.mavat_status = p.`status` and s.meirim_status in (\''+meirimStatuses.CANCELLED+'\',\''+meirimStatuses.APPROVED+'\'))');
  });;
  };

exports.down = async function(knex) {
    await knex.schema.table('plan', table => {
        table.dropColumns('was_deposited');
    });
};