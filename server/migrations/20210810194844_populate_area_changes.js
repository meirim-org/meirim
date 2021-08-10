const populatePlanAreaChanges = require('../bin/populate_plan_area_changes');


exports.up = async function(knex) {
  await populatePlanAreaChanges();
};

exports.down = function(knex) {
  knex.raw('DELETE FROM plan_area_changes');
};
