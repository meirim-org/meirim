const Controller = require('../controller/controller');
const Plan = require('../model/plan');
const { Knex } = require('../service/database');
class PlanController extends Controller {


  browse(req) {
    
    const columns = [
      'id',
      'PLAN_COUNTY_NAME',
      'PL_NUMBER',
      'PL_NAME',
      'PLAN_CHARACTOR_NAME',
      'goals_from_mavat',
      'main_details_from_mavat',
    ];
    
    const {query} = req;
    const where = {};

    if (query.status) {
      where.status = query.status.split(',');
    }

    if (query.PLAN_COUNTY_NAME) {
      where.PLAN_COUNTY_NAME = query.PLAN_COUNTY_NAME.split(',');
    }  

    return super.browse(req, {
      columns,
      where
    })
  }
  county () {
      return Knex
        .raw(`SELECT DISTINCT PLAN_COUNTY_NAME FROM plan`)
        .then(results => results[0])
  }
  statuses () {
    return Knex
      .raw(`SELECT DISTINCT status FROM plan`)
      .then(results => results[0])
}
}

module.exports = new PlanController(Plan);
