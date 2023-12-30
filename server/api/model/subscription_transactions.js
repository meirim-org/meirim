const Checkit = require('checkit');

const Model = require('./base_model');
const Exception = require('./exception');
const { Knex } = require('../service/database');

class SubscriptionTransactions extends Model {
  get rules() {
    return {
      yaad_id: ['required', 'integer'],
      hk_id: 'integer',
      person_id: ['required', 'integer'],
      amount: ['required', 'integer'],
    };
  }

  get requireFetch() {
    return true;
  }

  get hasTimestamps() {
    return true;
  }

  get tableName() {
    return 'subscription_transactions';
  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }

  _saving(model) {
    return new Checkit(model.rules).run(model.attributes);
  }

  canRead() {
    return Promise.resolve(this);
  }

  canEdit(session) {
    throw new Exception.NotAllowed('Cannot edit funding transactions');
  }

  static canCreate(session) {
    return Promise.resolve(this);
  }

  static getLastTransaction(person_id) {
    return Knex('subscription_transactions')
      .where({ person_id })
      .orderBy('created_at', 'desc')
      .first();
  }
}

module.exports = SubscriptionTransactions;
