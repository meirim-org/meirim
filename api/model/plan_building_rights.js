const Model = require('./base_model');

class PlanPerson extends Model {
  get rules() {
    return {
      plan_id: ['required', 'integer'],
      person_id: ['required', 'integer'],
      designation: ['required', 'string'],
    };
  }

  get tableName() {
    return 'plan_building_rights';
  }


}
module.exports = PlanPerson;
