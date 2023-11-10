const { Person, SubscriptionPlans } = require('../model');
const { BadRequest } = require('../model/exception');

const alertChecker = async req => {
  const personPlanId = (await Person.getById(req.session.person.id))
    .subscribe_plan_id;

  const alertsQty = personPlanId
    ? await SubscriptionPlans.getPlanAlertsQty(personPlanId)
    : 1;

  const personAlerts = await Person.getAlerts(req.session.person.id);

  if (req.body.type === 'plan') {
    const activePlanAlerts = personAlerts.filter(
      item => item.type === 'plan' && !item.disabled,
    );

    if (!personPlanId && activePlanAlerts.length >= 1) {
      throw new BadRequest('You already have a free active plan alert');
    }

    if (personPlanId && activePlanAlerts.length >= alertsQty) {
      throw new BadRequest(
        `You already have ${activePlanAlerts.length} active plan alerts`,
      );
    }
  }
};

module.exports = alertChecker;
