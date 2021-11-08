

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

	async refreshTags (plan, tagger) {

		try {
			await PlanTag.deletePlanTags(plan.id);
		}
		catch(e) {
			// if the deletion of existing tags fails, move to the next plan
			Log.info('failed to delete plan tags');
			return [];
		}

		const tags = await tagger(plan);
		if (tags && tags.length > 0) {
			//TODO REM
			console.log(tags);
			await PlanTag.createPlanTags(tags);
		}

		return tags;
	}

}

module.exports = new PlanTagController(PlanTag);
