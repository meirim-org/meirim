const { tags } = require('../../constants');
const { isHousing } = require('../tags/housing');
const Exception = require('../../../api/model/exception');
const functions = {'isHousing':isHousing};

const generateTagsForPlan = async (planId) => {
	const planTags = [];
	for (const tagCounter in tags) {
		const { tagId, tagName,functionName}  = tags[tagCounter];
		try {
			const tagFunction = functions[functionName];
			if (typeof(tagFunction) != "function") {
				throw new Exception.BadRequest(`"${functionName}" must be a function that determines if tag "${tagName}" applies. Please require it and add it to the functions object`);
			};
			const result = await tagFunction(planId, tagId);
			planTags.push(...result);
		} catch (err) {
			console.debug(err);			
		}
	} 
	return planTags;	
}

module.exports = {
	generateTagsForPlan
};