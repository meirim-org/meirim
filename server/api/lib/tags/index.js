const Exception = require('../../../api/model/exception');
const { getTagsResources } = require('../tags/tags_resources');

const housingTag = require('../tags/housing');
const publicBuildingsTag = require('../tags/public');
const forestTag = require('../tags/forests');
const streamTag = require('./streams');
const lightRailTag = require('./light_rail');

const taggingFunctions = [
	housingTag,
	publicBuildingsTag,
	forestTag,
	streamTag,
	lightRailTag
];


const getPlanTagger = async () => {
	const resources = await getTagsResources();

	return async (plan) => {
		const planTags = [];
		for (const tagFunction of taggingFunctions) {
			const result = await tagFunction.doesTagApply(plan, resources);

			if (result) {
				planTags.push(result);
			}

		}
		return planTags;
	};
};


module.exports = getPlanTagger;