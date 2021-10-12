// Hoteliery: (request to build a completely new hotel [not an addition to an existing one]) or
// (request to build more than 200 mr of hoteliery) or
// (request to enlarge existing building rights of hoteliery by more than 30%).
const { doesTagApplyHelper} = require('../tags/utils');
const TAG_NAME = 'Hoteliery';
const TAG_DISPLAY_NAME = 'מלונאות';

const doesTagApply = async (planId, tagsResources) => {  
	return doesTagApplyHelper(planId,TAG_NAME, tagsResources);
}

module.exports = {
	doesTagApply, 
	TAG_NAME,
	TAG_DISPLAY_NAME
};

