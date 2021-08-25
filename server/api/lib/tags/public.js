// Public area tag applies if the change to either public area meets the minimum threshold
const { doesTagApplyHelper} = require('../tags/utils');
const TAG_NAME = 'מבני ציבור';

const doesTagApply = async (plan, tags_resources) => {
	return doesTagApplyHelper(plan.id, TAG_NAME);
};

module.exports = {
	doesTagApply
};