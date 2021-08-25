const turf = require('turf');
const spatial_utils = require('../spatial_utils');


const TAG_ID = 2;

const doesTagApply = async (plan, tags_resources) => {

    const bottlenecksInvolved = [];
    tags_resources.bottlenecks.forEach(bottleneck => {
        const intersection = spatial_utils.intersectPolyOrMultiPolyWithMultiPoly(plan.attributes.geom, bottleneck.geom);
        //const intersection = turf.intersect(plan.attributes.geom, bottleneck.geom.geometry);

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
            tag_id: TAG_ID,
            display_score: 0, /* TODO: Add the correct display score here */
            created_by_data_rules: JSON.stringify(bottlenecksInvolved)
        };
    }

    return null;

};

module.exports = {
    doesTagApply
};