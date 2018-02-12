'use strict';
const Model = require("./base_model");
const Bookshelf = require('../service/database').Bookshelf;
class Status extends Model {

  get tableName() {
    return 'status';
  }

  canRead(session) {
    return true;
  }

  getCollection() {
    return this.collection();
  }
};
module.exports = Status;
