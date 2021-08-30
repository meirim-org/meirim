// Employment  tag applies Employment: 
// (request to build a completely new employment area with a size bigger than 200 mr [not an addition to an existing one]) 
// or (request to build more than 2000 mr of employment).
const { doesTagApplyHelper} = require('../tags/utils');
const TAG_NAME = 'תעסוקה';

const doesTagApply = async (planId, tagsResources) => {  
	return doesTagApplyHelper(planId,TAG_NAME, tagsResources);
}

module.exports = {
	doesTagApply, 
	TAG_NAME
};