// Housing tag applies if the change to either housing by area or housing by units meets the minimum threshold
const { doesTagApplyHelper} = require('../tags/utils');
const TAG_NAME = 'Housing';
const TAG_DISPLAY_NAME = 'דיור';

const doesTagApply = async (planId, tagsResources) => {
	return doesTagApplyHelper(planId, TAG_NAME, tagsResources);
};

module.exports = {
	doesTagApply,
	TAG_NAME,
	TAG_DISPLAY_NAME
};