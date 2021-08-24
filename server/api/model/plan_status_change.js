const Model = require('./base_model');
const Log = require('../lib/log');

class PlanStatusChange extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			status: 'string', // enum code
			date: 'string', // status date, as shown in mavat
			status_description: 'string', // text as shown in mavat
		};
	}

	get tableName () {
		return 'plan_status_change';
	}

	static getStatusesByPlan(planID) {
		return PlanStatusChange.where({ plan_id: planID }) .fetchAll();
	}

	static async saveBulk(planStatuses) {
		try {
			await PlanStatusChange.collection()
				.add(planStatuses)
				.invokeThen('save',null, { method: 'insert' });
			return planStatuses;
		}
		catch(e){
			Log.error(e);
			Log.error('couldnt save plan statuses');
			return [];
		}
	}

	static async savePlanStatusChange(planStatuses) {
		//compare to existing records in db. save only new ones.
		const existing_records = await this.getStatusesByPlan(planStatuses[0].attributes.plan_id);
		const existing_statuses = existing_records.models.map(record => record.attributes.status);
		const newStatues = planStatuses.filter((status) => existing_statuses.indexOf(status.attributes.status) == -1);
		Log.debug('plan id:',planStatuses[0].attributes.plan_id );
		Log.debug('newStatuses:', newStatues);
		await this.saveBulk(newStatues);
	}
}

module.exports = PlanStatusChange;
