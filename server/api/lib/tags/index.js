const Mustache = require('mustache');
const { tags } = require('../../constants');
const { isHousing } = require('../tags/housing');

const generateTagsForPlan = async (planId) => {
    const planTags = [];
    
    for (const {tagId: id, tagName: name, tagHelperFunction: helperFunction} of tags) {
        const result = await eval(Mustache.render(helperFunction, { tagId: id, planId: planId }));
        planTags.push(...result);
		return planTags;
    } 
}

module.exports = {
    generateTagsForPlan
};