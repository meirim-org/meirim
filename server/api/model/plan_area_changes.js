const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const { Bookshelf, Knex } = require('../service/database');
const {	tags, tagDataRules } = require('../constants');

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

	static async isHousingByArea(planId) {
        try {
            const rawSql = `SELECT plan_id,change_to_approved_state,\`usage\` 
            FROM plan_area_changes WHERE plan_id = ${planId} AND \`usage\`='${tagDataRules['housingByArea'].usage}' 
            AND cast(REGEXP_REPLACE(change_to_approved_state, '[\,+]', '') as unsigned)>${tagDataRules['housingByArea'].minValue}
            AND SUBSTR(change_to_approved_state,1,1)='+'` ;
            const result = await Bookshelf.knex.raw(rawSql);
            let resultFromDb= Object.values(result)[0];
            if (resultFromDb.length>0) {
                return {   
                    tag_id: tags['דיור'], 
                    created_by_data_rules: `{rule:'${tagDataRules['housingByArea'].description}$',
                    detail:'adds ${resultFromDb[0].change_to_approved_state} ${resultFromDb[0].usage}'}`
                }; 
            } 
           
        } catch (error) {
            console.log(`error ${error.message}\n`);
            console.debug(error);
        }
	}

	static async isHousingByUnits(planId) {
        try {
            const rawSql = `SELECT plan_id,change_to_approved_state,\`usage\` 
            FROM plan_area_changes WHERE plan_id = ${planId} 
            AND \`usage\`='${tagDataRules['housingByUnits'].usage}' 
            AND cast(REGEXP_REPLACE(change_to_approved_state, '[\,+]', '') as unsigned)>${tagDataRules['housingByUnits'].minValue}
            AND SUBSTR(change_to_approved_state,1,1)='+'` ;
            const result = await Bookshelf.knex.raw(rawSql);
            let resultFromDb= Object.values(result)[0];
            if (resultFromDb.length>0) {
                return {   
                    tag_id: tags['דיור'], 
                    created_by_data_rules: `{   rule: ${tagDataRules['housingByUnits'].description}$,
                    detail:'adds ${resultFromDb[0].change_to_approved_state} ${resultFromDb[0].usage}'}`
                }; 
            } 
           
        } catch (error) {
            console.log(`error ${error.message}\n`);
            console.debug(error);
        }
	}


}


 
 
module.exports =  PlanTag ;
