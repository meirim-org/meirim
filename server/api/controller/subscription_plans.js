const Controller = require('../controller/controller');
const SubscriptionPlans = require('../model/subscription_plans');
const { Person, Alert, SubscriptionTransactions } = require('../model');
const Exception = require('../model/exception');
const moment = require('moment');
const { Knex } = require('../service/database');
const { BadRequest } = require('../model/exception');
const { paymentServices: Config } = require('../lib/config');
const axios = require('axios');

class SubscriptionPlansController extends Controller {
  async browse() {
    return await SubscriptionPlans.getPlansList();
  }

  async create(req) {
    const personId = req.body.person_id;
    const { planId: newPlanId, mode } = req.body.redirect_params;
    const newAlertsQty = await SubscriptionPlans.getPlanAlertsQty(newPlanId);
    const personAlerts = await Person.getAlerts(personId);

    const activePersonPlans = personAlerts.filter(
      alert => alert.type === 'plan' && !alert.disabled,
    );

    if (req.body.redirect_params.CCode === '0') {
      const subscriptionTransaction = new SubscriptionTransactions({
        // yaad_id: req.body.yaad_id,
        yaad_id: Math.floor(Math.random() * 100000000),
        person_id: personId,
        hk_id: req.body.hk_id,
        amount: req.body.amount,
      });

      await subscriptionTransaction
        .save(null, { autoRefresh: false })
        .then(() => true)
        .catch(err => {
          console.error(err);
        });

      if (mode === 'relativeUpgrade' || mode === 'upgrade') {
        if (activePersonPlans.length >= newAlertsQty) {
          await Person.updateIsReachedMaxAlerts(personId, true);
        }

        if (activePersonPlans.length < newAlertsQty) {
          await Person.updateIsReachedMaxAlerts(personId, false);
        }

        await Person.updateSubscribePlanId(personId, newPlanId);
      }

      if (mode === 'downgrade') {
        try {
          const {
            created_at,
          } = await SubscriptionTransactions.getLastTransaction(personId);

          const subscriptionEndDate = moment(created_at)
            .add(1, 'month')
            .format('YYYY-MM-DD');

          await Knex('scheduled_tasks').where('person_id', personId).del();

          await Knex('scheduled_tasks').insert({
            person_id: personId,
            subscription_id: newPlanId,
            date: subscriptionEndDate,
          });
        } catch (err) {
          console.error(err);
          throw new BadRequest('Something went wrong');
        }
      }
    }
  }

  async getPaymentLink(req) {
    const {
      id: personId,
      subscribe_plan_id: currentPlanId,
    } = req.session.person;
    const newPlanId = parseInt(req.params.plan_id, 10);
    const currentPlanPrice = currentPlanId
      ? await SubscriptionPlans.getPlanPrice(currentPlanId)
      : null;
    const newPlanPrice = await SubscriptionPlans.getPlanPrice(newPlanId);

    try {
      // Upgrade with No previous plan logic
      if (currentPlanPrice === null) {
        return `http://localhost:3000/alerts/success?HKId=424350&Id=145288655&CCode=0&Amount=${newPlanPrice}&ACode=0204860&Order=&Fild1=Steve%20Jobs&Fild2=steve%40jobs.com&Fild3=&Sign=c874af589a9428657bb7c9903a10e0304f0e6638d06231d7b24ac677d9739604&planId=${newPlanId}&mode=upgrade`;
      }

      // Upgrade with relative price logic
      if (currentPlanPrice < newPlanPrice) {
        const lastTransaction = await SubscriptionTransactions.getLastTransaction(
          personId,
        );

        await Knex('scheduled_tasks').where('person_id', personId).del();

        if (lastTransaction) {
          const lastDate = moment(lastTransaction.created_at.toLocaleString());
          const todayDate = moment(Date.now().toLocaleString());
          const diff = todayDate.diff(lastDate, 'days') || 31;
          const relativePrice = (newPlanPrice - currentPlanPrice) * (diff / 31);
            return `http://localhost:3000/alerts/success?HKId=424350&Id=145288655&CCode=0&Amount=${relativePrice.toFixed(
              2,
            )}&ACode=0204860&Order=&Fild1=Steve%20Jobs&Fild2=steve%40jobs.com&Fild3=&Sign=c874af589a9428657bb7c9903a10e0304f0e6638d06231d7b24ac677d9739604&planId=${newPlanId}&mode=relativeUpgrade`;
        }
      }

      // Downgrade logic
      if (currentPlanPrice > newPlanPrice) {
        return `http://localhost:3000/alerts/success?HKId=424350&Id=145288655&CCode=0&Amount=${newPlanPrice}&ACode=0204860&Order=&Fild1=Steve%20Jobs&Fild2=steve%40jobs.com&Fild3=&Sign=c874af589a9428657bb7c9903a10e0304f0e6638d06231d7b24ac677d9739604&planId=${newPlanId}&mode=downgrade`;
      }
    } catch (err) {
      console.log(err);
      throw new Exception.BadRequest('Something went wrong');
    }
  }

  paymentLink(req) {
    const { query } = req;

    let instance = axios.create({
      baseURL: Config.baseURL,
    });

    const paymentUrlConfig = {
      action: 'APISign',
      What: 'SIGN',
      KEY: Config.apiKey,
      PassP: Config.PassP,
      Masof: Config.masofId,
      UTF8: 'True',
      UTF8out: 'True',
      Coin: 1,
      sendemail: 'True',
      SendHesh: 'True',
      PageLang: 'HEB',
      tmp: 11,
      Pritim: 'True',
      OnlyOnApprove: 'True',
      Sign: 'True',
    };

    let params = {
      ...paymentUrlConfig,
      Amount: !isNaN(query.amount) ? query.amount : 228,
    };

    if (query.monthly) {
      params.HK = 'True';
      params.Info = 'Subscription transaction';
      params.heshDesc = [
        '',
        'תרומה%20חודשית%20לעמותת%20מעירים',
        '1',
        `${params.Amount}`,
      ].join('~');
      params.Tash = 999;
    } else {
      params.Info = 'תרומה חד פעמית לעמותת מעירים';
      params.heshDesc = [
        '',
        'תרומה%20חד%20פעמית%20לעמותת%20מעירים',
        '1',
        `${params.Amount}`,
      ].join('~');
    }

    return instance
      .get('/p3/', {
        params,
      })
      .then(res => `${Config.baseURL}/p3/?action=pay&${res.data}`);
  }
}

module.exports = new SubscriptionPlansController(SubscriptionPlans);
