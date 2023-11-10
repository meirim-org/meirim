const { Person, SubscriptionPlans } = require('../model');

const alertCheckerUpdate = async req => {
  const personId = req.session
    ? req.session.person.id
    : req._previousAttributes.person_id;

  const personSubscriptionId = (await Person.getById(personId))
    .subscribe_plan_id;

  const alertsQty = personSubscriptionId
    ? await SubscriptionPlans.getPlanAlertsQty(personSubscriptionId)
    : 1;
  const personAlerts = await Person.getAlerts(personId);

  const activePlanAlerts = personAlerts.filter(
    item => item.type === 'plan' && !item.disabled,
  );

  await Person.updateIsReachedMaxAlerts(personId, false);

  if (activePlanAlerts.length >= alertsQty) {
    await Person.updateIsReachedMaxAlerts(personId, true);
  }
};

module.exports = alertCheckerUpdate;
