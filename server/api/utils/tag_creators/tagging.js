const { HotelsTag } = require('./hotels');

class PlanTagging {
    tagCreators = [];

    constructor() {
        this.tagCreators.push(new HotelsTag());
    }

    /* Get a list of matched tags according to a given plan. */
    async matchTags(plan) {
        const promises = this.tagCreators.map((tagCreator) => this.matchTagsPerTagCreator(tagCreator, plan));
        const results = await Promise.all(promises);
        return results.flat();
    }

    async matchTagsPerTagCreator(tagCreator, plan) {
        const result = await tagCreator.tagPlan(plan);
        const results = [];

        if (result.match) {
            results.push({
                id: tagCreator.id,
                score: result.score,
            });

            if (tagCreator.parent) {
                results.push({
                    id: tagCreator.parent,
                    score: 1,
                });
            }
        }

        return results;
    }
}

module.exports = {PlanTagging};