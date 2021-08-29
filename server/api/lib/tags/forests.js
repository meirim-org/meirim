const { isTagApplyTable4FatherCategory} = require('../tags/utils');

const TAG_NAME = 'יער';

const doesTagApply = async (plan, tagsResources) => {
    return await isTagApplyTable4FatherCategory(plan.id,
        (fatherCategory) => fatherCategory.includes('יער'),
        TAG_NAME,
        tagsResources,
        {rule: 'has "יער" in a father category in chart 4'}
    );
};

module.exports = {
    doesTagApply,
    TAG_NAME
};