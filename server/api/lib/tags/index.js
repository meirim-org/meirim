const Exception = require('../../../api/model/exception');
const TagsResources = require('../tags/tags_resources');

const taggingFunctions = [
	require('../tags/housing'),
	require('../tags/public'),
	require('../tags/ecological_bottlenecks/ecological_bottlenecks')
];


// TODO: REMOVE THIS
/*
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
};


 */

class PlanTagger {

	async generateTagsForPlan(plan) {
		const planTags = [];
		for (const tagFunction of taggingFunctions) {
			const result = await tagFunction.doesTagApply(plan, PlanTagger.resources);

			if (result !== null) {
				planTags.push(result);
			}

		}
		return planTags;
	};
}

PlanTagger.resources = new TagsResources.TagsResources();


module.exports = {
	//generateTagsForPlan
	PlanTagger
};