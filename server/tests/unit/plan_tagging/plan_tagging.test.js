const expect = require('chai').expect;
const { PlanTagging } = require('../../../api/utils/tag_creators/tagging');

describe('Plan tagging', function() {
	let instance;
    
	beforeEach(function () {
		instance = new PlanTagging();
	});

	afterEach(function() {
		instance = null;
	});

	it('should match the correct tags according to the plan object', async function() {
		// We only care about `areaChanges` for this test
		const samplePartialPlan = {
			areaChanges: JSON.stringify([
				[
				  {
						'1': '2000698299',
						'2': '120',
						'3': 'מלון',
						'4': 'יח"ד',
						'5': '',
						'6': '+201',
						'7': '16',
						'8': '',
						'9': ''
				  },
				  {
						'1': '2000698301',
						'2': '125',
						'3': 'מגורים (מ"ר)',
						'4': 'מ"ר',
						'5': '+2,813.76',
						'6': '+164.16',
						'7': '2,977.92',
						'8': '',
						'9': ''
				  }
				]
			  ]),
		};

		const tags = await instance.matchTags(samplePartialPlan);
        
		expect(tags).to.eql([{ id: 'HOTELS', score: 100 }]);
	});

	// TODO: Inject mocked tag creators during test instead of testing real ones (we already have specific tests for specific tag creators).
	// TODO: Test that if a tag creator has a parent, the parent will be part of the results as well.
});
