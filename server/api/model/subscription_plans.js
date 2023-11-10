const Checkit = require('checkit');
const Exception = require('./exception');
const { Knex } = require('../service/database');
const Model = require('./base_model');

class SubscriptionPlans extends Model {
  get hasTimestamps() {
    return false;
  }

  get tableName() {
    return 'subscription_plans';
  }

  get requireFetch() {
    return false;
  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }

  _saving(model) {
    return new Checkit(model.rules).run(model.attributes);
  }

  setPerson(session) {
    if (this.rules.person_id && session.person) {
      this.set('person_id', session.person.id);
    }
  }

  canRead() {
    throw new Exception.NotAllowed('Must be logged in');
  }

  static canCreate() {
    throw new Exception.NotAllowed('Must be logged in');
  }

  getCollection() {
    return this.collection().fetch();
  }

  static getPlansList() {
    return Knex('subscription_plans').select('*').where({ type: 'public' });
  }

  static async getPlanPrice(plan_id) {
    return (
      await Knex('subscription_plans')
        .select('price')
        .where({ id: plan_id })
        .first()
    ).price;
  }

  static async getPlanAlertsQty(plan_id) {
    return (
      await Knex('subscription_plans')
        .select('alerts_qty')
        .where({ id: plan_id })
        .first()
    ).alerts_qty;
  }
}

module.exports = SubscriptionPlans;
