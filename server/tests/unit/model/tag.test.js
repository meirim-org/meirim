
const expect = require('chai').expect;
const { Tag } = require('../../../api/model');

describe('Plan Tag model', function() {
	let instance;
	beforeEach(function () {
		instance = new Tag();
	}); 
	
	afterEach(function() {
		instance = null;
	});
	
	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.parent_id).to.eql(['integer']);
		expect(rules.display_name).to.eql(['string']);
		expect(rules.score).to.eql([ 'integer']);
		expect(rules.is_super_tag).to.eql(['boolean']);
		expect(rules.is_stand_alone).to.eql(['boolean']);
		expect(rules.display_tooltip).to.eql(['string']);
});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('tag');
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