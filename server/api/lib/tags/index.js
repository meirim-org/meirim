
const Exception = require('../../../api/model/exception');
const functions = [require('../tags/housing'),require('../tags/public'),require('../tags/employment')];

const generateTagsForPlan = async (planId) => {
	const planTags = [];
	for (const counter in functions) {
		const tagFunction = functions[counter];
		try {
			if (typeof(tagFunction.doesTagApply) != "function") {
				throw new Exception.BadRequest(`"Please require only doesTagApply functions.`);
			};
			const result = await tagFunction.doesTagApply(planId);
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