const PlanAreaChanges = require('../../../api/model/plan_area_changes');
const { tagDataRules, area_change_types } = require('../../constants');

const isTagByUsageAddition = async (planId, rule) => {
	try {
		const result = await PlanAreaChanges.byPlanAndUsage(planId, rule.usage);
		if (result && result.models && result.models[0]) {
			const changeToApprovedState = result.models[0].attributes.change_to_approved_state;
			const approvedState = result.models[0].attributes.approved_state;
			switch (rule.changeType) {
				case area_change_types.INCREASED_USAGE:
					// change to approved state
					if ((changeToApprovedState.length > 1) && 
						(changeToApprovedState.substring(0,1) === '+') ) {
						const change = Number(changeToApprovedState.replace('+','').replace(',',''));
						if (change >= Number(rule.minValue)) {
							return {   
								created_by_data_rules: `{rule:'${rule.description}',detail:'adds ${changeToApprovedState} ${rule.usage}'}`
							}; 
						}
					}					
					break;	
				case area_change_types.NEW_USAGE:
					// new usage that was not approved previously
					if ((changeToApprovedState.length > 1) && 
					(changeToApprovedState.substring(0,1) === '+') && 
					(approvedState === '')) {
					const change = Number(changeToApprovedState.replace('+','').replace(',',''));
					if (change >= Number(rule.minValue)) {
						return {   
							created_by_data_rules: `{rule:'${rule.description}',detail:'adds ${changeToApprovedState} ${rule.usage}'}`
						}; 
					}					
					break;
				}
			}			
		}		
	} catch (error) {
		console.log(`error ${error.message}\n`);
		console.debug(error);
	}
}

const doesTagApplyHelper = async (planId,tagName) => {  
	const planTags = [];
	const dataRules = [];	
	const tagInfo = tagDataRules.filter(tag => {return tag.tagName===tagName})[0];
	const tagId = tagInfo.tagId;
	for (const counter in tagInfo.rules) {
		const rule = tagInfo.rules[counter];
		try {
			const isTag = await isTagByUsageAddition(planId, rule);
			if (isTag) {
				dataRules.push(
					isTag.created_by_data_rules
				);
			}

		} catch (err) {
			console.debug(err);			
		}
			
	} 
	if (dataRules.length>0) {
		planTags.push( {
			plan_id: planId,
			tag_id: tagId,
			display_score: 0, /* TODO: Add the correct display score here */
			created_by_data_rules: `[${dataRules.toString(',')}]`
		});
	}
	return planTags;
}



module.exports = {
	isTagByUsageAddition, doesTagApplyHelper
};