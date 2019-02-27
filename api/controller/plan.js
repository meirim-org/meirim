const Controller = require('../controller/controller');
const Plan = require('../model/plan');
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
}

module.exports = new PlanController(Plan);
