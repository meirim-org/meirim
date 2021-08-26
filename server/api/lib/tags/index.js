const Exception = require('../../../api/model/exception');
const { getTagsResources } = require('../tags/tags_resources');

const housingTag = require('../tags/housing');
const publicBuildingsTag = require('../tags/public');
const ecologicalBottlenecksTag = require('../tags/ecological_bottlenecks/ecological_bottlenecks');

const taggingFunctions = [
	housingTag,
	publicBuildingsTag,
	ecologicalBottlenecksTag
];


const getPlanTagger = async () => {
	const resources = await getTagsResources();

	return async (plan) => {
		const planTags = [];
		for (const tagFunction of taggingFunctions) {
			const result = await tagFunction.doesTagApply(plan, resources);

			if (result !== null) {
				planTags.push(result);
			}

		}
		return planTags;
	};
};


module.exports = {
	getPlanTagger
};