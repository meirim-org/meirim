const Exception = require('../../../api/model/exception');
const { getTagsResources } = require('../tags/tags_resources');

const heavyRailTag = require('../tags/heavy_rail');
const roadsTag = require('../tags/roads');

const taggingFunctions = [
	heavyRailTag,
	roadsTag,
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