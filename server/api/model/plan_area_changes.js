const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const { Bookshelf, Knex } = require('../service/database');
const {	tags } = require('../constants');

class PlanTag extends Model {
	get rules () {
		return {
			id: ['required', 'integer'],
            plan_id: ['required', 'integer'],
			usage: ['text'],
			measurement_unit: ['text'],
			approved_state: ['text'],
			change_to_approved_state: ['text'],
            total_in_detailed_plan: ['text'],
            total_in_detailed_plan: ['text'],
            total_in_detailed_plan: ['text']
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

	static async isHousingBySqaureMeters(planId) {
        console.log(`isHousingBySqaureMeters for plan ID ${planId}}`);

        try {
            const rawSql = `SELECT plan_id,change_to_approved_state,\`usage\` 
            FROM plan_area_changes WHERE plan_id = ${planId} AND \`usage\`='מגורים (מ"ר)' 
            AND cast(REGEXP_REPLACE(change_to_approved_state, '[\,+]', '') as unsigned)>1000
            AND SUBSTR(change_to_approved_state,1,1)='+'` ;
            const result = await Bookshelf.knex.raw(rawSql);
            console.log(`inside isHousingBySqaureMeters`);
            let resultFromDb= Object.values(result)[0];
            console.log(`resultFromDb.length = ${resultFromDb.length}`);
            if (resultFromDb.length>0) {
                return {   tagApplies: true, 
                    tag_id: tags['דיור'], 
                    display_score: 0,
                    created_by_data_rules: 'adds more than 1,000 sqm of housing'
                }; 
            } else {
                return {  tagApplies: false }
            }
           
        } catch (error) {
            console.log(`error ${error.message}\n`);
            console.debug(error);
        }



	}




}


 
 
module.exports =  PlanTag ;
