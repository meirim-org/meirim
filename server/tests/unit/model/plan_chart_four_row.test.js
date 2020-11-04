const expect = require('chai').expect;
const { PlanChartFourRow } = require('../../../api/model');

describe('plan chart four row model', function() {
    let instance;

	beforeEach(function () {
		instance = new PlanChartFourRow();
	}); 
	
	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.plan_id).to.eql(['required', 'integer']);
        expect(rules.category_number).to.eql('string');
        expect(rules.category).to.eql('string');
        expect(rules.father_category_number).to.eql('string');
        expect(rules.father_category).to.eql('string');
        expect(rules.text).to.eql('string');
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('table_4_area_designation_and_usage');
	});

	it('has no timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(false);
	});
});
