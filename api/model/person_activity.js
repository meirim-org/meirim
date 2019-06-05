const Model = require('./base_model');

class PersonActivity extends Model {
  get rules() {
    return {
      activity_id: ['required', 'integer'],
      person_id: ['required', 'integer'],
    };
  }

  get tableName() {
    return 'person_activity';
  }
}
module.exports = PersonActivity;
