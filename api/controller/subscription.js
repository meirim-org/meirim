const Log = require('../lib/log');
const Controller = require('./controller');
const PlanPerson = require('../model/plan_person');
const {
  Bookshelf,
} = require('../service/database');

class PlanPersonController extends Controller {

  subscribe(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    }
    // the user is found, creating a new subscription
    return this.model.subscribe(req.session.person.id, req.params.id)
      .then((subscription) => {
        Log.debug('Person subscription created create success id:', subscription.get('person_id'));
      });
  }

  unsubscribe(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    }
    // the user is found, creating a new subscription
    return this.model.unsubscribe(req.session.person.id, req.params.id)
      .then(() => {
        Log.debug('Person subscription created removed');
      });
  }
}

module.exports = new PlanPersonController(PlanPerson);
