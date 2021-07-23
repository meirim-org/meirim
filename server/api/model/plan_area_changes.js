const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const { Bookshelf, Knex } = require('../service/database');

class PlanAreaChanges extends Model {
	get rules () {
		return {
			id: ['required', 'integer'],
            plan_id: ['required', 'integer'],
			usage: ['text'],
			measurement_unit: ['text'],
			approved_state: ['text'],
			change_to_approved_state: ['text'],
            total_in_detailed_plan: ['text'],
            total_in_mitaarit_plan: ['text'],
            remarks: ['text']
		}

	}

	get tableName () {
		return 'plan_area_changes';
	}

	canRead () {
		return true;
	}

	getCollection () {
		return this.collection();
	}

    static async byPlanAndUsage (planId, usage) {
		if (!planId) {
			throw new Exception.BadRequest('Must provide planId');
		}
		if (!usage) {
			throw new Exception.BadRequest('Must provide usage');
		}		
        Log.info(`checking for planId ${planId} and usage ${usage}`);
        const result = await this.query('where', 'plan_id', '=', planId)
            .query('where', 'usage', '=', usage)
			.fetchAll();
		return result;
	}

	static async deleteByPlan ( planId) {
		return this.query('where', 'plan_id', '=', planId)
			.destroy({require: false})
			.then(() => true);
	}    

	// adds multiple changes in one transcation
	static async createPlanAreaChanges( data) {
		try {
			await Bookshelf.transaction(async (transaction) => {
				for (const datum in data ){
                    const currentChange = data[datum];
                     await Knex.raw(`INSERT INTO plan_area_changes (plan_id, \`usage\`, measurement_unit, approved_state, change_to_approved_state, total_in_detailed_plan, total_in_mitaarit_plan, remarks) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [currentChange.plan_id,currentChange.usage,currentChange.measurement_unit,currentChange.approved_state,currentChange.change_to_approved_state,
                    currentChange.total_in_detailed_plan,currentChange.total_in_mitaarit_plan,currentChange.remarks]);
                }            
            });
		} catch (err){
			console.log(err);
		}

	}	    


}


 
 
module.exports =  PlanAreaChanges ;
