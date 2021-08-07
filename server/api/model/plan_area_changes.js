const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const { Bookshelf, Knex } = require('../service/database');

class PlanAreaChanges extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			usage: ['string'],
			measurement_unit: ['string'],
			approved_state: ['string'],
			change_to_approved_state: ['string'],
			total_in_detailed_plan: ['string'],
			total_in_mitaarit_plan: ['string'],
			remarks: ['string']
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
					await new PlanAreaChanges(currentChange).save(null, { transcating: transaction});
				}
			});
		} catch (err){
			console.log(err);
		}

	}
}


 
 
module.exports =  PlanAreaChanges ;
