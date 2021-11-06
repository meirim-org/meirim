const TAG_NAME = 'Light Rail';
const TAG_DISPLAY_NAME = 'רכבת קלה';

const rakevetKala = 'רכבת קלה';
const rakal = 'רק"ל';
const tzomet = 'צומת';
const tzir = 'ציר';

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

    if (!planName.includes(tzomet) && !planName.includes(tzir)) {

        if (planName.includes(rakevetKala)) {
            return getReturnDict(rakevetKala);
        }
        if (planName.includes(rakal)) {
            return getReturnDict(rakal);
        }

    }

    return null;
};

module.exports = {
    doesTagApply,
    TAG_NAME,
    TAG_DISPLAY_NAME
};