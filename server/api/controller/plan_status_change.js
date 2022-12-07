const Controller = require('./controller');
const PlanStatusChange = require('../model/plan_status_change');
const Plan = require('../model/plan');
const Log = require('../lib/log');
const { debug } = require('../lib/log');

class PlanStatusChangeController extends Controller {

	/**
	 * Return status for this plan.
	 * @param {IncomingRequest} req
	 */
	async byPlan (req) {
		const planId =req.params.id;
		const PLAN_TYPE_77_78 = "הודעה לפי סעיף 77 ו 78 לחוק התכנון והבניה";
		let planType, planCreatedAt;
		planType=null;

		await Plan.fetchByPlanID(planId)
		.then(plan => {
			if (plan) {
				planType = (plan.attributes.data.ENTITY_SUBTYPE_DESC);
				planCreatedAt = plan.attributes.created_at;
				Log.debug('planType ', planType), 'planCreatedAt ', planCreatedAt;
		}})
		.catch(error => {
			Log.error('Plan.fetchByPlanID failed to fetch plan details');
			Log.error(error.message);
			Log.error(error.stack);
			
		});

		if (!planType) {
			return {"cancellationDate": null, "steps": []};;
		}

		return this.model.byPlan(planId).then(collection => {
			Log.debug(this.tableName, 'Get status list', req.params.id);
			
			let steps = [];
			/* If the plan type (סוג תוכנית) = הודעה לפי סעיף 77 ו 78 לחוק התכנון והבניה, add a stepId:0, 
			set to date: plan.createddate, completed:true, current:true, and all other steps to false for both. */
			if (planType===PLAN_TYPE_77_78) {
				steps = [{name:'',description:'',stepId: 0, completed: true, current: true, date: '01/01/2000'}];
				Log.debug(`Plan type is '${PLAN_TYPE_77_78}' so setting step zero as `, steps);
			}

			// if date is not null, set completed to true
			steps = steps.concat(collection.map(function(element){
				element.completed = element.date===null ? false : true;
				return element;
			}));

			// find the latest step this plan has reached
			const maxStep= Math.max(...[-1],...steps.filter(step => step.completed===true ).map(step => step.stepId));
			Log.debug('Max Step', maxStep);

			/* mark latest step as the current one 
			/* If there is no plan_status table, set stepId: 1 to completed:True and Current:True, and the rest of the steps to completed:false and current:false 
			*/
			steps = steps.map(function(element){
				element.current = false;
				if ( (maxStep===-1 && element.stepId===1)) {
					Log.debug('max step is -1 and current step is 1 so setting current to true, and complete to true for step 1');
					element.current = true;
					element.completed = true;
				} else if (element.stepId===maxStep) {
					Log.debug('Max step reached so setting current to true for step', maxStep);
					element.current = true;					
				} else if (element.stepId<maxStep) {
					Log.debug(`element.stepId is ${element.stepId} and maxStep is ${maxStep}`);
					// some status changes are missing, so if a status was reached, assume the previous ones were completed
					// excpetion: if the plan is canceled, the previous step (approval) shouldn't be completed
					if ((maxStep===5)&&(element.stepId===maxStep-1)){
						Log.debug(`Skipping because reaching step 5 does not mean that step 4 happened`);
						return element;	
					}
					Log.debug(`Setting completed to true`);
					element.completed = true;
				}
				return element;
			});	
			
			// if the plan was canceled, set the cancelation date
			const cancellationDate = maxStep!==5 ? null : steps.find(element => element.stepId === 5).date;
			// remove the RowDataPacket 
			steps = steps.map((result) => ({
				...result,
			})); 	
			const ret = {"cancellationDate": cancellationDate, "steps": steps};
		
			return ret;
		});
	}
}
module.exports = new PlanStatusChangeController(PlanStatusChange);



