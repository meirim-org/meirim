const Model = require('./base_model');
const Log = require('../lib/log');
const { Knex } = require('../service/database');


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

	/**
	 * Return plan's status list
	 * @param {planID} integer
	 */
	 static async byPlan (planID) {
		const res = await Knex.raw(
			`SELECT name,explanation AS description ,step_id AS stepId,date FROM status 
			LEFT JOIN  
			( 
				SELECT c.plan_id,min(c.date) as date,m.meirim_status
				FROM status_mapping m 
				JOIN plan_status_change c  on m.mavat_status = c.status 
				 WHERE plan_id=? 
				 GROUP BY c.plan_id,m.meirim_status
				 ORDER BY MIN(c.date) ASC
			 ) AS plan_status_log
			ON status.name = plan_status_log.meirim_status 
			WHERE ((step_id>=1 AND step_id<=4) OR (plan_id=?))`
			, [planID, planID]
		);
		return res[0];
	}	
	
	/**
	 * Return all mavat statuses for a meirim status
	 * @param {meirimStatus} string 
	 * @returns array of mavat statuses
	 */
	static async getAllStatuses() {
		const res = await Knex.raw(
			`SELECT m.mavat_status, m.meirim_status
				FROM status_mapping m`);
		return res;
	}
}

module.exports = PlanStatusChange;
