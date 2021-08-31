const PlanAreaChanges = require('../../model/plan_area_changes');

const TAG_NAME = 'רכבת כבדה';

const doesTagApply = async (plan, tagsResources) => {

    const planName = plan.attributes.PL_NAME;
    const badWords = ['מסילות', 'מכללה', 'איחוד וחלוקה', 'ביטול', 'מסילת ישרים', 'פארק', 'מגדל'];

    for (const word of badWords) {
        if (planName.includes(word)) {
            return null;
        }
    }

    if ((planName.includes('רכבת') && !planName.includes('קלה'))
        || (planName.includes('מסיל') && !planName.includes('מסילת ציון') && !planName.includes('קלה'))) {

        // STREET NAMES STUFF HERE
        for (const streetName of tagsResources.streetNames) {
            const streetNameRegex = new RegExp(`${streetName} ([0-9])+`, 'g');
            if (streetNameRegex.test(planName)) {
                return null;
            }

        }

        const isAdditionsToHousing = await PlanAreaChanges.isAdditionInUsage(plan.id, 'מגורים (מ"ר)');
        if (!isAdditionsToHousing) {
            return {
                plan_id: plan.id,
                tag_id: tagsResources.tagNameToTagId[TAG_NAME],
                display_score: 0, /* TODO: Add the correct display score here */
                created_by_data_rules: ''
            };
        }

        return null;

    }


};

module.exports = {
    doesTagApply,
    TAG_NAME
};