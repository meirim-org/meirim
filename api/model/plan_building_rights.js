const Model = require('./base_model');

class PlanBuildingRights extends Model {
  get rules() {
    // TODO - this is the source of truth, make sure the extractor returns the same attributes
    return {
      plan_id: ['required', 'integer'],
      designation: ['required', 'string'],
      use: ['required', 'string'],
      plotNumbers: ['required', 'string'],
      sizeSqm: ['required', 'integer'],
      abovePrimaryMain: ['required', 'integer'],
      abovePrimaryMainService: ['required', 'integer'],
      belowPrimaryMain: ['required', 'integer'],
      belowPrimaryMainService: ['required', 'integer'],
      tahsit: ['required', 'integer'],
      numOfHousingUnits: ['required', 'integer'],
      floorsAbove: ['required', 'integer'],
      comments: ['required', 'string'],
    };
  }

  get tableName() {
    return 'plan_building_rights';
  }

  parse(attributes) {
    try {
        // TODO - each field can have (some_number) as well. we need to parse it out and add this to the comments
    } catch (e) {
        Log.error("Json parse error", attributes.data);
    }

    return super.parse(attributes);
}


}
module.exports = PlanBuildingRights;
