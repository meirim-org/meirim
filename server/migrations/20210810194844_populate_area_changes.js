const populatePlanAreaChanges = require('../bin/populate_plan_area_changes');


exports.up = async function(knex) {
  await populatePlanAreaChanges();
};

exports.down = async function(knex) {
  await knex('plan_area_changes').del();
};
