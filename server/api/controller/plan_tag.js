const Controller = require('../controller/controller');
const PlanTag = require('../model/plan_tag');
const Log = require('../lib/log');


class PlanTagController extends Controller {
	/**
	 * Return tags for this plan.
	 * @param {IncomingRequest} req
	 */
	byPlan (req) {
		return this.model.byPlan(req.params.plan_id).then(collection => {
			Log.debug(this.tableName, 'Get tag list', req.params.plan_id);
			return collection;
		});
	}

}

module.exports = new PlanTagController(PlanTag);
