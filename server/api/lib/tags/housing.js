// Housing tag applies if the change to either housing by area or housing by units meets the minimum threshold
const { isTagByUsageAddition} = require('../tags/utils');

const isHousing = async (planId, tag) => {  
	const HOUSING_BY_AREA = 'housingByArea';
	const HOUSING_BY_UNITS = 'housingByUnits';
	const planTags = [];
	const dataRules = [];
	
	// check housing by area
	const housingByArea = await isTagByUsageAddition(planId,tag,HOUSING_BY_AREA); 
	if (housingByArea) {
		dataRules.push(
			housingByArea.created_by_data_rules
		);
	}
	// check housing by units
	const housingByUnits = await isTagByUsageAddition(planId,tag,HOUSING_BY_UNITS);
	if (housingByUnits) {
		dataRules.push(
			housingByUnits.created_by_data_rules
		);
	}
	if (housingByArea || housingByUnits)
		planTags.push( {
			plan_id: planId,
			tag_id: tag,
			display_score: 0, /* TODO: Add the correct display score here */
			created_by_data_rules: `[${dataRules.toString(',')}]`
		});
	return planTags;
}

module.exports = {
	isHousing
};