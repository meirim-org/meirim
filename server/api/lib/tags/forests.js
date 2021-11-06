const { isTagApplyTable4FatherCategory} = require('../tags/utils');

const TAG_NAME = 'Forest';
const TAG_DISPLAY_NAME = 'יער';

const doesTagApply = async (plan, tagsResources) => {
    return await isTagApplyTable4FatherCategory(plan.id,
        (fatherCategory) => fatherCategory.includes('יער'),
        TAG_NAME,
        tagsResources,
        {rule: `has "${TAG_DISPLAY_NAME}" in a father category in chart 4`}
    );
};

module.exports = {
    doesTagApply,
    TAG_NAME,
    TAG_DISPLAY_NAME
};