const { TagCreatorInterface } = require('./base');

class HotelsTag extends TagCreatorInterface {
	id = 'HOTELS';
	parent = '';
	
	rules = {
		first: {
			// Exact match
			term: 'חדרי מלון / תיירות (מ"ר)',
		},
		second: {
			// Contains the term
			term: 'מלון',
		},
	};

	constructor() {
		super();
	}

	tagPlan(plan) {
		if (plan.areaChanges) {
			const areaChanges = JSON.parse(plan.areaChanges);

			if (areaChanges.length && areaChanges[0].length) {
				const includesRelevantAreaChange = areaChanges[0].some((areaChange) => this.isRelevantAreaChange(areaChange));

				if (includesRelevantAreaChange) {
					return Promise.resolve({
						match: true,
						score: 100,
					});
				}
			}
		}

		return Promise.resolve({
			match: false,
		});
	}

	isRelevantAreaChange(areaChange) {
		const changeType = areaChange['3'];
		const changeForApprovedStateValue = this.areaChangeParseNumericValue(areaChange['6']);
		const currentApprovedStateValue = this.areaChangeParseNumericValue(areaChange['5']);

		if (changeType === this.rules.first.term) {
			return changeForApprovedStateValue > 200 || (changeForApprovedStateValue / currentApprovedStateValue) >= 0.3;
		}

		if (changeType.includes(this.rules.second.term) && !currentApprovedStateValue && changeForApprovedStateValue) {
			return true;
		}
		
		return false;
	}

	areaChangeParseNumericValue(value) {
		if (!value.length) {
			return undefined;
		}

		return parseFloat(value.replace(/\-|\+/g, ""));
	}
}

module.exports = { HotelsTag };
