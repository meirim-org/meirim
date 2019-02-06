const Bluebird = require('bluebird');
const Model = require('./base_model');
const {
  Knex,
} = require('../service/database');
const Log = require('../lib/log');
const Exception = require('./exception');

class Plan extends Model {
  get rules() {
    return {
      sent: 'integer',
      OBJECTID: [
        'required', 'integer',
      ],
      PLAN_COUNTY_NAME: 'string',
      PL_NUMBER: 'string',
      PL_NAME: 'string',
      // PLAN_CHARACTOR_NAME: 'string',
      data: ['required'],
      geom: ['required', 'object'],
      jurisdiction: 'string'
    };
  }

  defaults() {
    return {
      sent: 0,
    };
  }
  // support json encode for data field
  format(attributes) {
    if (attributes.data) {
      attributes.data = JSON.stringify(attributes.data);
    }
    return super.format(attributes);
  }

  // support json encode for data field
  parse(attributes) {

    try {
      if (attributes.data) {
        attributes.data = JSON.parse(attributes.data);
      }
    } catch (e) {
      Log.error('Json parse error', attributes.data);
    }

    return super.parse(attributes);
  }

  get geometry() {
    return ['geom'];
  }

  get tableName() {
    return 'plan';
  }

  get jurisdiction() {
    return 'jurisdiction';
  }

  get isLocalAuthority() {

  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }

  _saving(model, attrs, options) {
    // return new Checkit(model.rules).run(model.attributes);
  }

  canRead(session) {
    return Bluebird.resolve(this);
  }

  static canCreate(session) {
    throw new Exception.NotAllowed('This option is disabled');
  }

  static maekPlansAsSent(plan_ids) {
    return new Plan().query(qb => {
      qb.whereIn('id', plan_ids);
    }).save({
      sent: '2',
    }, {
      method: 'update',
    });
  }

  static fetchByObjectID(objectID) {
    return Plan.forge({
      OBJECTID: objectID,
    }).fetch();
  }

  static buildFromIPlan(iPlan, oldPlan = null) {
    const data = {
      OBJECTID: iPlan.properties.OBJECTID,
      PLAN_COUNTY_NAME: iPlan.properties.PLAN_COUNTY_NAME || '',
      PL_NUMBER: iPlan.properties.PL_NUMBER || '',
      PL_NAME: iPlan.properties.PL_NAME || '',
      // 'PLAN_CHARACTOR_NAME': iPlan.properties.PLAN_CHARACTOR_NAME || '',
      data: iPlan.properties,
      geom: iPlan.geometry,
      PLAN_CHARACTOR_NAME: '',
      plan_url: iPlan.properties.PL_URL,
    };
    if (oldPlan) {
      oldPlan.set(data);
      return oldPlan.save();
    }

    const plan = new Plan(data);
    return plan.save();
  }

  static setMavatData(plan, mavanData) {
    return plan.set({
      goals_from_mavat: mavanData.goals,
      main_details_from_mavat: mavanData.mainPlanDetails,
      jurisdiction: mavanData.jurisdiction,
    });
  }

  static getUnsentPlans(userOptions) {
    const options = userOptions ? userOptions : {};
    if (!options.limit) {
      options.limit = 1;
    }
    return Plan.query((qb) => {
      qb.where('sent', '=', '0');
      if (options.OBJECTID) {
        qb.where('OBJECTID', '=', options.OBJECTID);
      }
    }).fetchPage({
      pageSize: options.limit,
      columns: ['id', 'data', 'goals_from_mavat', 'main_details_from_mavat', 'geom', 'jurisdiction'],
    });
  }
};
module.exports = Plan;