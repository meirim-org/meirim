const Controller = require('./controller');
const PlanStatusChange = require('../model/plan_status_change');
const Plan = require('../model/plan');
const Log = require('../lib/log');
const PLAN_TYPE_77_78 = {
	name: 'פרסום על הכנת תוכנית', 
	description:'הודעה לפי סעיף 77 ו 78 לחוק התכנון והבניה'
};

class PlanStatusChangeController extends Controller {

	/**
	 * Return status for this plan.
	 * @param {IncomingRequest} req
	 */
	async byPlan (req) {
		const planId =req.params.id;		
		let planType, planCreatedAt;
		planType=null;

		await Plan.fetchByPlanID(planId)
			.then(plan => {
				if (plan) {
					planType = (plan.attributes.data.ENTITY_SUBTYPE_DESC);
					planCreatedAt = plan.attributes.created_at;
				}})
			.catch(error => {
				Log.error(`Plan.fetchByPlanID failed to fetch plan details ${error.message} ${error.stack} `);	
			});

		if (!planType) {
			return { 'cancellationDate': null, 'steps': [] };
		}

		return this.model.byPlan(planId).then(collection => {
			Log.debug(this.tableName, 'Get status list', req.params.id);
			
			let steps = [];
			/* If the plan type (סוג תוכנית) = הודעה לפי סעיף 77 ו 78 לחוק התכנון והבניה, add a stepId:0, 
			set to date: plan.createddate, completed:true, current:true, and all other steps to false for both. */
			if (planType===PLAN_TYPE_77_78.description) {
				steps = [{ name:PLAN_TYPE_77_78.name,description:PLAN_TYPE_77_78.description,stepId: 0, completed: true, current: true, date: planCreatedAt }];
				Log.debug(`Plan type is '${PLAN_TYPE_77_78.name}' so setting step zero as `, steps);
			}

			const ret = Plan.getStatusChanges(collection, steps);
		
			return ret;
		});
	}
}
module.exports = new PlanStatusChangeController(PlanStatusChange);



