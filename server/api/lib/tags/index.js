const Exception = require('../../../api/model/exception');
const { getTagsResources } = require('../tags/tags_resources');

const housingTag = require('../tags/housing');
const publicBuildingsTag = require('../tags/public');
const forestTag = require('../tags/forests');
const riverTag = require('../tags/rivers');

const taggingFunctions = [
	housingTag,
	publicBuildingsTag,
	forestTag,
	riverTag
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