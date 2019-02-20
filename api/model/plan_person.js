'use strict';
const Base_model = require("./base_model");
const Bookshelf = require('../service/database').Bookshelf;

class PlanPerson extends Base_model {
  get rules() {
    return {
      plan_id: [
        'required', 'integer'
      ],
      person_id: [
        'required', 'integer'
      ],
      follow: ['integer']
    }
  }
  get tableName() {
    return 'plan_person';
  }
  static subscribe(personId, planId) {
    return this
      .query('where', 'person_id', '=', personId)
      .query('where', 'plan_id', '=', planId)
      .fetchAll()
      .then((existingSubscription) => {
      // if it exists- updating it
        if (existingSubscription && existingSubscription.length > 0) {
          return Promise.resolve(existingSubscription.models[0]);
        }
        return this.forge({
          person_id: personId,
          plan_id: planId,
          follow: 1,
        }).save();
      });
  }

  static unsubscribe(planId, personId) {
    return Plan.forge({
      person_id: personId,
      plan_id: plan_id
    }).fetch();
  }
};
module.exports = PlanPerson;
