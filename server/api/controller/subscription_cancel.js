const Controller = require('../controller/controller');
const { Person, SubscriptionTransactions } = require('../model');
const { BadRequest } = require('../model/exception');
const moment = require('moment');
const { Knex } = require('../service/database');

class SubscriptionCancelController extends Controller {
  async browse(req) {
    const { id: personId } = req.session.person;
    const { is_subscription_canceled } = await Knex('person')
      .where({ id: personId })
      .select('is_subscription_canceled')
      .first();

    const task = await Knex('scheduled_tasks')
      .where({ person_id: personId })
      .select('date', 'subscription_id')
      .first();

    if (!task) return {};

    const { date: end_date, subscription_id: new_plan_id } = task;

    return { is_subscription_canceled, end_date, new_plan_id };
  }
  async cancel(req) {
    const { id: personId } = req.session.person;

    const { created_at } = await SubscriptionTransactions.getLastTransaction(
      personId,
    );

    const subscriptionEndDate = moment(created_at)
      .add(1, 'month')
      .format('YYYY-MM-DD');

    if (await Person.isSubscriptionCanceled(personId)) {
      throw new BadRequest(
        `You already canceled your subscription. It will stay active until ${subscriptionEndDate}`,
      );
    }

    try {
      await Knex('scheduled_tasks').where({ person_id: personId }).del();

      await Knex('scheduled_tasks').insert({
        person_id: personId,
        subscription_id: null,
        date: subscriptionEndDate,
      });
      await Person.updateIsSubscriptionCanceled(personId, true);
      return { end_date: subscriptionEndDate };
    } catch (err) {
      console.error(err);
      throw new BadRequest('Something went wrong');
    }
  }
}

module.exports = new SubscriptionCancelController(Person);
