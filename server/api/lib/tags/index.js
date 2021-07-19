 const { tags, tagDataRules } = require('../../constants');
 const PlanAreaChanges = require('../../../api/model/plan_area_changes');

 const  generateTagsForPlan = async (planId) => {
    let planTags = [];
    let dataRules = [];
    // HOUSING
    const housingTag = tags['דיור'];
    // check housing by square meters
    const housingByArea = await isTag(planId,housingTag,'housingByArea'); 
        if (housingByArea) {
            dataRules.push( 
            housingByArea.created_by_data_rules
        );
    }
    // check housing by area
    const housingByUnits = await isTag(planId,housingTag,'housingByUnits');
    if (housingByUnits) {
        dataRules.push( 
            housingByUnits.created_by_data_rules
        );
    }
    if (housingByArea || housingByUnits)
    planTags.push( {
        plan_id: planId,
        tag_id: housingTag,
        display_score: 0, /* TODO: Add the correct display score here */
        created_by_data_rules: `[${dataRules.toString(',')}]`
    });
    return planTags;
}

const isTag = async (planId, tag, rule) => {
    try {
        const result = await PlanAreaChanges.byPlanAndUsage(planId, tagDataRules[rule].usage);
        if (result && result.models && result.models[0]) {
            const changeToApprovedState = result.models[0].attributes.change_to_approved_state;
            if ( (changeToApprovedState.length>1) && 
                (changeToApprovedState.substring(0,1)==='+') ) {
                const change = Number(changeToApprovedState.replace('+',''));
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
	generateTagsForPlan, isTag
};