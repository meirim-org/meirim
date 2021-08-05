const { tagDataRules } = require('../../constants');
const PlanAreaChanges = require('../../../api/model/plan_area_changes');

const isTagByUsageAddition = async (planId, tag, rule) => {
	try {
		const result = await PlanAreaChanges.byPlanAndUsage(planId, tagDataRules[rule].usage);
		if (result && result.models && result.models[0]) {
			const changeToApprovedState = result.models[0].attributes.change_to_approved_state;
			if ( (changeToApprovedState.length>1) && 
				(changeToApprovedState.substring(0,1)==='+') ) {
				const change = Number(changeToApprovedState.replace('+','').replace(',',''));
				if (change>= Number(tagDataRules[rule].minValue)) {
					return {   
						tag_id: tag, 
						created_by_data_rules: `{rule:'${tagDataRules[rule].description}',detail:'adds ${changeToApprovedState} ${tagDataRules[rule].usage}'}`
					}; 
				}
			}

		}		
		
	   
	} catch (error) {
		console.log(`error ${error.message}\n`);
		console.debug(error);
	}
}



module.exports = {
	isTagByUsageAddition
};