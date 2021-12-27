
const Exception = require('../../../api/model/exception');
const { getTagsResources } = require('../tags/tags_resources');

const housingTag = require('../tags/housing');
const publicBuildingsTag = require('../tags/public');
const employmentTag = require('../tags/employment');
const hotelieryTag = require('../tags/hoteliery');
const commerceTag = require('../tags/commerce');
const forestTag = require('../tags/forests');
const streamTag = require('./streams');
const lightRailTag = require('./light_rail');

const taggingFunctions = [
	housingTag,
	publicBuildingsTag,
	employmentTag,
	hotelieryTag,
	commerceTag,
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