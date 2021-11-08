
const expect = require('chai').expect;
const { PlanTag } = require('../../../api/model');

describe('Plan Tag model', function() {
	let instance;
	beforeEach(function () {
		instance = new PlanTag();
	}); 
	
	afterEach(function() {
		instance = null;
	});
	
	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.tag_id).to.eql(['required', 'integer']);
		expect(rules.plan_id).to.eql(['required', 'integer']);
		expect(rules.display_score).to.eql(['integer']);
		expect(rules.created_by_data_rules).to.eql(['string']);
		expect(rules.created_by_child).to.eql(['boolean']);
		expect(rules.child_is_stand_alone).to.eql(['boolean']);
		expect(rules.creation_date).to.eql(['datetime']);
		
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('plan_tag');
	});

	it('has the right defaults', function() {
		const defaults = instance.defaults;
		expect(defaults).to.eql(null);
	});

	it('has timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(false);
	});
});