'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Bcrypt = require('bcrypt');
const Bookshelf = require("./bookshelf");
const Exception = require('./exception');
class Status extends Bookshelf.Model{
  get rules() {
    return {
      id: [
        'required', 'integer'
      ],
      name: [
        'required', 'string'
      ]
    }
  }


  get tableName() {
    return 'status';
  }

  get hasTimestamps() {
    return false;
  }
  notActive() {
    switch (this.get("name")){
      case "":
        return false;
    }
    return true;
  }

  validateSave(model, attrs, options) {
    return Checkit(this.rules).run(this.attributes);
  }
};
module.exports = Bookshelf.model('status', Status);
