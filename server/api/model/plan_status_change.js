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

	static async getStatusesByPlan(planID) {
		return new PlanStatusChange({
			plan_id: planID
		}).fetchAll();
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

		const existing = await (await this.getStatusesByPlan(planStatuses[0].attributes.plan_id)).map(status => status.attributes.status);
		const newStatues = planStatuses.filter(status => existing.indexOf(status.attributes.status) == -1);
		await this.saveBulk(newStatues);
	}
}

module.exports = PlanStatusChange;
