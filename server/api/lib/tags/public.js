// Public area tag applies if the change to either public area meets the minimum threshold
const { doesTagApplyHelper} = require('../tags/utils');
const TAG_NAME = 'Public';
const TAG_DISPLAY_NAME = 'מבני ציבור';

const doesTagApply = async (planId, tagsResources) => {
	return doesTagApplyHelper(planId, TAG_NAME, tagsResources);
};

module.exports = {
	doesTagApply,
	TAG_NAME,
	TAG_DISPLAY_NAME
};