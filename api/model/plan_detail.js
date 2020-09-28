const Model = require('./base_model');
const Exception = require('./exception');

class PlanDetail extends Model {
  get rules () {
    return {
      planId: ['required', 'integer'],
      tag: ['required', 'string'],
      detail: ['required', 'string'],
      area_designation_from: ['string'],
      area_designation_to: ['string']
    }
  }

  get tableName () {
    return 'plan_details'
  }

  static byPlan (planId) {
    if (!planId) {
      throw new Exception.BadRequest('Must provide planId')
    }
    return this.query('where', 'planId', '=', planId).fetchAll()
  }
}

module.exports = PlanDetail;
