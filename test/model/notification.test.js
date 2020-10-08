const expect = require('chai').expect;
const { Notification } = require('../../api/model');

describe('notification model', function() {
	let instance;
	beforeEach(function () {
		instance = new Notification();
	}); 
	
	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.person_id).to.eql(['required', 'integer']);
		expect(rules.plan_id).to.eql(['required', 'integer']);
		expect(rules.seen).to.eql('boolean');
		expect(rules.type).to.eql(['required', 'string' ]);
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('notification');
	});

	it('has the right defaults', function() {
		const defaults = instance.defaults();
		expect(defaults).to.eql({seen: false});
	});

	it('has timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(true);
	});
});