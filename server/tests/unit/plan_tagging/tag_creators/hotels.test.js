const expect = require('chai').expect;
const { HotelsTag } = require('../../../../api/utils/tag_creators/hotels');

const rules = {
	first: {
		term: 'חדרי מלון / תיירות (מ"ר)',
	},
	second: {
		term: 'מלון',
	},
};

describe('Hotels tag creator', function() {
	let instance;
    
	beforeEach(function () {
		instance = new HotelsTag();
	});

	afterEach(function() {
		instance = null;
	});

	it(`should return a match if 'areaChanges' including the exact term "${rules.first.term}" in field 3 and if field 6 is > 200`, async function() {
		// We only care about `areaChanges` for this test
		const samplePartialPlan = {
			areaChanges: JSON.stringify([
				[
				  {
						'1': '2000698299',
						'2': '120',
						'3': rules.first.term,
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

		const result = await instance.tagPlan(samplePartialPlan);
        
		expect(result).to.eql({ match: true, score: 100 });
	});

	it(`should return a match if 'areaChanges' including the exact term "${rules.first.term}" in field 3 and if field 6 is at least 30% of field 5`, async function() {
		// We only care about `areaChanges` for this test
		const samplePartialPlan = {
			areaChanges: JSON.stringify([
				[
				  {
						'1': '2000698299',
						'2': '120',
						'3': rules.first.term,
						'4': 'יח"ד',
						'5': '+590',
						'6': '+199',
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

		const result = await instance.tagPlan(samplePartialPlan);
        
		expect(result).to.eql({ match: true, score: 100 });
	});

	it(`should return a match if there are relevant values in 'areaChanges' including the term "${rules.second.term}"`, async function() {
		// We only care about `areaChanges` for this test
		const samplePartialPlan = {
			areaChanges: JSON.stringify([
				[
				  {
						'1': '2000698299',
						'2': '120',
						'3': `bla bla ${rules.second.term} bla bla`,
						'4': 'יח"ד',
						'5': '',
						'6': '213',
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

		const result = await instance.tagPlan(samplePartialPlan);
        
		expect(result).to.eql({ match: true, score: 100 });
	});

	it('shouldn\'t return a match for irrelevant values in \'areaChanges\'', async function() {
		// We only care about `areaChanges` for this test
		const samplePartialPlan = {
			areaChanges: JSON.stringify([
				[
				  {
						'1': '2000698299',
						'2': '120',
						'3': 'מגורים (יח"ד)',
						'4': 'יח"ד',
						'5': '+16',
						'6': '',
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

		const result = await instance.tagPlan(samplePartialPlan);
        
		expect(result).to.eql({ match: false });
	});
});
