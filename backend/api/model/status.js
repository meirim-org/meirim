'use strict';
const Base_model = require("./base_model");
const Exception = require('./exception');
const Bookshelf = require('../service/database').Bookshelf;

class Status extends Bookshelf.Model {
  get rules() {
    return {
      id: [
        'required', 'integer'
      ],
      name: ['required', 'string']
    }
  }

  get tableName() {
    return 'status';
  }

  notActive() {
    switch (this.get("name")) {
      case "":
        return false;
      default:
    }
    return true;
  }

};
module.exports = Bookshelf.model('status', Status);
