const TAG_NAME = 'רכבת קלה';

const doesTagApply = async (plan, tagsResources) => {
    const getReturnDict = (stringInPlanName) => {
      return {
          plan_id: plan.id,
          tag_id: tagsResources.tagNameToTagId[TAG_NAME],
          display_score: 0, /* TODO: Add the correct display score here */
          created_by_data_rules: JSON.stringify([{ rule: `has "${stringInPlanName}" in plan name` }])
      };
    };

    const planName = plan.attributes.PL_NAME;

    if (!planName.includes('צומת') && !planName.includes('ציר')) {

        if (planName.includes('רכבת קלה')) {
            return getReturnDict('רכבת קלה');
        }
        if (planName.includes('רק"ל')) {
            return getReturnDict('רק"ל');
        }

    }

    return null;
};

module.exports = {
    doesTagApply,
    TAG_NAME
};