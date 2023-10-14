const {	meirimStatuses } = require('../api/constants');

exports.up = function(knex) {
    return knex.raw('ALTER TABLE `plan` CHANGE COLUMN `was_deposited` `status_email` TINYINT(1) NULL DEFAULT \'0\';').then(() => {
      return knex.raw('UPDATE plan set status_email=3 where id in (select distinct p.plan_id from plan_status_change p join status_mapping s on s.mavat_status = p.`status` and s.meirim_status in (\''+meirimStatuses.CANCELLED+'\',\''+meirimStatuses.APPROVED+'\'))');
  });
  };

exports.down = async function(knex) {
    await knex.raw('ALTER TABLE `plan` CHANGE COLUMN `status_email` `was_deposited` TINYINT(1) NULL DEFAULT \'0\';');
};