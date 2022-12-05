const Controller = require('./controller');
const PlanStatusChange = require('../model/plan_status_change');
const Log = require('../lib/log');
const { debug } = require('../lib/log');

class PlanStatusChangeController extends Controller {

	/**
	 * Return status for this plan.
	 * @param {IncomingRequest} req
	 */
	 byPlan (req) {
		return this.model.byPlan(req.params.id).then(collection => {
			Log.debug(this.tableName, 'Get status list', req.params.id);
			// if date is not null, set completed to true
			let steps = collection.map(function(element){
				element.completed = element.date===null ? false : true;
				return element;
			});

			// find the latest step this plan has reached
			const maxStep= Math.max(...[-1],...steps.filter(step => step.completed===true ).map(step => step.stepId));
			Log.debug('Max Step', maxStep);

			/* mark latest step as the current one 
			/* If there is no plan_status table, set stepId: 1 to completed:True and Current:True, and the rest of the steps to completed:false and current:false 
			*/
			steps = steps.map(function(element){
				const x = null;
				if ((element.stepId===maxStep) || (maxStep===-1 && element.stepId===1)) {
					element.current = true;
					element.completed = true;
				} else {
					element.current = false;
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


			/* TODO: If one of the plan statuses is אחר set stepId: 1 to completed:True and Current:True, 
			and the rest of the steps to completed:false and current:false */

			/* TODO: If the plan type (סוג תוכנית) = הודעה לפי סעיף 77 ו 78 לחוק התכנון והבניה, add a stepId:0, 
			set to date: plan.createddate, completed:true, current:true, and all other steps to false for both. */
			

			return ret;
		});
	}
}
module.exports = new PlanStatusChangeController(PlanStatusChange);



