const spatial_utils = require('../spatial_utils');

const TAG_NAME = 'צוואר בקבוק מסדרון אקולוגי';

const doesTagApply = async (plan, tagsResources) => {

    const bottlenecksInvolved = [];
    tagsResources.bottlenecks.forEach(bottleneck => {
        const intersection = spatial_utils.intersectPolyOrMultiPolyWithMultiPoly(plan.attributes.geom, bottleneck.geom);

        if (intersection != null) {
            bottlenecksInvolved.push({
                bottleneckName: bottleneck.name,
                dunam: intersection / 1000
            });
        }
    });

    if (bottlenecksInvolved.length > 0) {
        return {
            plan_id: plan.id,
            tag_id: tagsResources.tagNameToTagId[TAG_NAME],
            display_score: 0, /* TODO: Add the correct display score here */
            created_by_data_rules: JSON.stringify(bottlenecksInvolved)
        };
    }

    return null;

};

module.exports = {
    doesTagApply,
    TAG_NAME
};