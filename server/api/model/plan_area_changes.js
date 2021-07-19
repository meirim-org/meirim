const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const { Bookshelf, Knex } = require('../service/database');
const {	tags, tagDataRules } = require('../constants');

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
        console.log(`checking for planId ${planId} and usage ${usage}`);
        const result = await this.query('where', 'plan_id', '=', planId)
            .query('where', 'usage', '=', usage)
			.fetchAll();
		return result;
	}


}


 
 
module.exports =  PlanAreaChanges ;
