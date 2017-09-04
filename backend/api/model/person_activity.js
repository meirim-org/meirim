'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Bcrypt = require('bcrypt');
const Bookshelf = require("./bookshelf");
const Exception = require('./exception');
class PersonActivity extends Bookshelf.Model{
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

  get hasTimestamps() {
    return false;
  }
  initialize() {
  }
  validateSave(model, attrs, options) {
    return Checkit(this.rules).run(this.attributes);
  }
};
module.exports = Bookshelf.model('Person_Activity', PersonActivity);
