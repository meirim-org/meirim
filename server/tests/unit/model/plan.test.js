const expect = require('chai').expect;
const { Plan } = require('../../../api/model');

describe('Plan model', function() {
	let instance;
	beforeEach(function () {
		instance = new Plan();
	}); 
	
	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.sent).to.eql('integer');
		expect(rules.OBJECTID).to.eql(['required', 'integer']);
		expect(rules.rating).to.eql(['required', 'number']);
		expect(rules.PL_NUMBER).to.eql('string');
		expect(rules.jurisdiction).to.eql('string');
		expect(rules.areaChanges).to.eql('string');
		expect(rules.PL_NAME).to.eql('string');
		expect(rules.status).to.eql('string');
		expect(rules.goals_from_mavat).to.eql('string');
		expect(rules.main_details_from_mavat).to.eql('string');
		expect(rules.plan_url).to.eql('string');
		expect(rules.data).to.eql([ 'required' ]);
		expect(rules.geom).to.eql([ 'required', 'object' ]);
		expect(rules.PLAN_COUNTY_NAME).to.eql('string');
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('plan');
	});

	it('has the right defaults', function() {
		const defaults = instance.defaults();
		expect(defaults).to.eql({sent: 0});
	});

	it('has timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(true);
	});

});
