const Model = require('./base_model')
const Person = require('./person')
const Plan = require('./plan')

class Impression extends Model {
  get rules () {
    return {
      person_id: ['required', 'integer'],
      plan_id: ['required', 'integer'],
      ip: ['required', 'integer']

    }
  }

  get tableName () {
    return 'impression'
  }

  person () {
    return this.belongsTo(Person)
  }

  plan () {
    return this.belongsTo(Plan)
  }

  initialize () {
    this.on('saving', this._saving, this)
    super.initialize()
  }
}
module.exports = Impression
