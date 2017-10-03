'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Model = require("./base_model");
const Bookshelf = require('../service/database').Bookshelf;
const Knex = require('../service/database').Knex;
const Log = require('../service/log');
const Exception = require('./exception');
class Plan extends Model {
  get rules() {
    return {
      sent: 'integer',
      OBJECTID: [
        'required', 'integer'
      ],
      PLAN_COUNTY_NAME: 'string',
      PL_NUMBER: 'string',
      PL_NAME: 'string',
      PLAN_CHARACTOR_NAME: 'string',
      data: ['required'],
      geom: ['required', 'object']

    }
  }
  defaults() {
    return {sent: 0}
  }
  format(attributes) {
    if (attributes.data){
      attributes.data = JSON.stringify(attributes.data);
    }
    return super.format(attributes);
  }
  //
  parse(attributes) {
    try {
      if (attributes.data) {
        attributes.data = JSON.parse(attributes.data);
      }

    } catch (e) {
      Log.error("Json parse error", attributes.data);
    }

    return super.parse(attributes);
  }

  get geometry() {
    return ['geom'];
  }

  get tableName() {
    return 'plan';
  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }
  _saving(model, attrs, options) {
    // return new Checkit(model.rules).run(model.attributes);
  }

  canRead(session) {
    return Promise.resolve(this);
  }
  static canCreate(session) {
    throw new Exception.notAllowed("This option is disabled");
  }
  static maekPlansAsSent(plan_ids) {
    return new Plan().query(qb => {
      qb.whereIn('id', plan_ids);
    }).save({
      sent: "1"
    }, {method: 'update'});
  }
  static getUnsentPlans(userOptions) {
    let options = userOptions
      ? userOptions
      : {};
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
      columns: ['id', 'data', Knex.raw("X(st_centroid(geom)) as lon"), Knex.raw("Y(st_centroid(geom)) as lat")]
    });
  }
};
module.exports = Bookshelf.model('plan', Plan);
