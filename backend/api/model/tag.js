'use strict';
const Model = require("./base_model");
const Bookshelf = require('../service/database').Bookshelf;
class Tag extends Model {

  get tableName() {
    return 'tag';
  }

  canRead(session) {
    return true;
  }

  getCollection() {
    return this.collection();
  }
};
module.exports = Tag;
