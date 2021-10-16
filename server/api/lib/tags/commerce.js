// Commerce: (request to build a completely new commerce area [not an addition to an existing one]) 
// or (request to build more than 100 mr of commerce) 
// or (request to enlarge existing building rights of commerce by more than 20%).
const { doesTagApplyHelper} = require('../tags/utils');
const TAG_NAME = 'Commerce';
const TAG_DISPLAY_NAME = 'מסחר';

const doesTagApply = async (planId, tagsResources) => {  
	return doesTagApplyHelper(planId,TAG_NAME, tagsResources);
}

module.exports = {
	doesTagApply, 
	TAG_NAME,
	TAG_DISPLAY_NAME
};