// const {	meirimStatuses } = require('../api/constants');

exports.up = function(knex) {
//     return knex.schema.table('plan', table => {
//       return knex.schema.hasColumn('plan', 'was_deposited').then((exists) => {
//         if(!exists) {
//           return table.boolean('was_deposited').default('false');  
//         }
//       });
//     }).then(() => {
//       // This should run when we're ready, by sets
//       // return knex.raw('UPDATE plan set was_deposited=true where id in (select distinct p.plan_id from plan_status_change p join status_mapping s on s.mavat_status = p.`status` and s.meirim_status in (\''+meirimStatuses.CANCELLED+'\',\''+meirimStatuses.APPROVED+'\', \''+meirimStatuses.PUBLIC_OBJECTION+'\'))');
//   });
  };

exports.down = async function(knex) {
//     await knex.schema.table('plan', table => {
//         table.dropColumns('was_deposited');
//     });
};