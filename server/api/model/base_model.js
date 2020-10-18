const Checkit = require('checkit');
const { Bookshelf } = require('../service/database');
const Exception = require('./exception');

class Base_model extends Bookshelf.Model {
  get hasTimestamps() {
    return false;
  }

  // this is added since we upgraded bookshelf past version 1.0 which made
  // fetch() calls require a record is returned, otherwise a custom error
  // is thrown. since we wrote our controllers using a previous version we
  // rely on a value or null to be returned in any case. when creating new
  // models we recommend this is overriden with the default true value and
  // fetch calls be written with this in mind
  get requireFetch() {
    return false;
  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }

  _saving(model, attrs, options) {
    return new Checkit(model.rules).run(model.attributes);
  }

  setPerson(session) {
    if (this.rules.person_id && session.person) {
      this.set('person_id', session.person.id);
    }
  }

  canRead(session) {
    throw new Exception.NotAllowed('Must be logged in');
  }

  static canCreate(session) {
    throw new Exception.NotAllowed('Must be logged in');
  }

  getCollection() {
    return this.collection().fetch();
  }
}
module.exports = Base_model;
