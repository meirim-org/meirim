'use strict';
const Base_model = require("./base_model");
const Bookshelf = require('../service/database').Bookshelf;
class PersonActivity extends Base_model{
  get rules() {
    return {
      activity_id: [
        'required', 'integer'
      ],
      person_id: [
        'required', 'integer'
      ]
    }
  }
  get tableName() {
    return 'person_activity';
  }
};
module.exports = PersonActivity;
