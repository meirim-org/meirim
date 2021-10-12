const Exception = require('../../../api/model/exception');
const { getTagsResources } = require('../tags/tags_resources');

const housingTag = require('../tags/housing');
const publicBuildingsTag = require('../tags/public');
const EmploymentTag = require('../tags/employment');
const HotelieryTag = require('../tags/hoteliery');
const CommerceTag = require('../tags/commerce');
const heavyRailTag = require('../tags/heavy_rail');
const roadsTag = require('../tags/roads');

const taggingFunctions = [
	housingTag,
	publicBuildingsTag,
	EmploymentTag,
	HotelieryTag,
	CommerceTag,
	heavyRailTag,
	roadsTag,
];

const getPlanTagger = async () => {
	const resources = await getTagsResources();
	return async (plan) => {
		const planTags = [];
		for (const tagFunction of taggingFunctions) {
			const result = await tagFunction.doesTagApply(plan.id, resources);

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