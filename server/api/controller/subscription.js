const Log = require('../lib/log');
const Controller = require('./controller');
const PlanPerson = require('../model/plan_person');
const Plan = require('../model/plan');
const Exception = require('../model/exception');

class PlanPersonController extends Controller {
  subscribe(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    }
    // the user is found, creating a new subscription
    return this.model
      .subscribe(req.session.person.id, req.params.id)
      .then(subscription => {
        Log.debug(
          'Person subscription created create success id:',
          subscription.get('person_id'),
        );
      });
  }

  async getUserPlans(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    }

    const userPlanIds = await PlanPerson.getPlansByUserId(
      req.session.person.id,
    );
    if (!userPlanIds || !userPlanIds.models) return [];
    const plans = await Promise.all(
      userPlanIds.models.map(({ attributes }) =>
        Plan.fetchByPlanID(attributes.plan_id),
      ),
    );

    return plans ? plans.map(({ attributes }) => ({ ...attributes })) : [];
  }

  unsubscribe(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    }
    // the user is found, creating a new subscription
    return this.model
      .unsubscribe(req.session.person.id, req.params.id)
      .then(() => {
        Log.debug('Person subscription created removed');
        return true;
      });
  }
}

module.exports = new PlanPersonController(PlanPerson);
