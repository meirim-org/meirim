// Housing tag applies if the change to either housing by area or housing by units meets the minimum threshold
const { doesTagApplyHelper} = require('../tags/utils');
const TAG_NAME = 'דיור';

const doesTagApply = async (planId) => {  
	return doesTagApplyHelper(planId,TAG_NAME);
}

module.exports = {
	doesTagApply
};