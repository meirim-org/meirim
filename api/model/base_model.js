const Checkit = require('checkit');
const { Bookshelf } = require('../service/database');
const Exception = require('./exception');

class Base_model extends Bookshelf.Model {
  get hasTimestamps() {
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
