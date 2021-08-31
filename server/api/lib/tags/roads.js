const TAG_NAME = 'כבישים';

const doesTagApply = async (plan, tagsResources) => {

    const planName = plan.attributes.PL_NAME;

    if (planName.includes('כביש') || planName.includes('מחלף') || planName.includes('מעגל תנועה')) {
        return {
            plan_id: plan.id,
            tag_id: tagsResources.tagNameToTagId[TAG_NAME],
            display_score: 0, /* TODO: Add the correct display score here */
            created_by_data_rules: JSON.stringify({ rule: 'includes "כביש" or "מחלף" or "מעגל תנועה"' })
        };
    }

    const patternWithNumbers = RegExp('דרך ([א-ת])* ([0-9]){1,}', 'g');
    const findPattern1 = RegExp('דרך ([א-ת])*', 'g');
    const findPattern2 = RegExp('דרך ([א-ת])* ([א-ת])*', 'g');

    let match1 = planName.match(findPattern1);
    if (!match1) {
        match1 = [];
    }

    let match2 = planName.match(findPattern2);
    if (!match2) {
        match2 = [];
    }
    const matches = match1.concat(match2);

    for(const match of matches) {
        if (tagsResources.streetNames.has(match)) {
            return null;
        }
    }

    if (planName.includes('דרך') && !planName.match(patternWithNumbers)) {
        return {
            plan_id: plan.id,
            tag_id: tagsResources.tagNameToTagId[TAG_NAME],
            display_score: 0, /* TODO: Add the correct display score here */
            created_by_data_rules: JSON.stringify({ rule: 'includes "דרך" and passed all the regexes' })
        };
    }

    return null;

};

module.exports = {
    doesTagApply,
    TAG_NAME
};