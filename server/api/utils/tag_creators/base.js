class TagCreatoerInterface {
	constructor() {
		if (!this.tagPlan) {
			throw new Error('Tag creator must have `tagPlan`');
		}
	}
}

module.exports = { TagCreatoerInterface };