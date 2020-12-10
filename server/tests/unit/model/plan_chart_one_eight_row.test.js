const expect = require('chai').expect;
const { PlanChartOneEightRow } = require('../../../api/model');

describe('plan chart one eight row model', function() {
    let instance;

	beforeEach(function () {
		instance = new PlanChartOneEightRow();
	}); 
	
	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.plan_id).to.eql(['required', 'integer']);
        expect(rules.origin).to.eql('string');
        expect(rules.profession).to.eql('string');
        expect(rules.type).to.eql('string');
        expect(rules.description).to.eql('string');
        expect(rules.name).to.eql('string');
        expect(rules.license_number).to.eql('string');
        expect(rules.corporate).to.eql('string');
        expect(rules.city).to.eql('string');
        expect(rules.street).to.eql('string');
        expect(rules.house).to.eql('string');
        expect(rules.phone).to.eql('string');
        expect(rules.fax).to.eql('string');
        expect(rules.email).to.eql('string');
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('tables_18_interests_in_plan');
	});

	it('has no timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(false);
	});
});
