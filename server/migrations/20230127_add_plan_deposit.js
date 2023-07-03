const {	meirimStatuses } = require('../api/constants');

exports.up = function(knex) {
    return knex.schema.table('plan', table => {
      table.boolean('was_deposited').default('false');
    }).then(() => handle(knex));
  };

async function handle(knex) {
  for (var i = 0; i < 35000; i+=1000) {
    var cmd = 'UPDATE plan set was_deposited=true where id in (select distinct p.plan_id from plan_status_change p join status_mapping s '+
    'on s.mavat_status = p.`status` and p.plan_id >= '
      +i+' and p.plan_id < '+(i+1000)+
      ' and s.meirim_status in (\''+meirimStatuses.CANCELLED+'\',\''+meirimStatuses.APPROVED+'\', \''+meirimStatuses.PUBLIC_OBJECTION+'\'))';
    console.error(cmd);
    await knex.raw(cmd);
  }
}

exports.down = async function(knex) {
    await knex.schema.table('plan', table => {
        table.dropColumns('was_deposited');
    });
};