const expect = require('chai').expect;
const { PlanStatusChange } = require('../../../api/model');

describe('AlePlanStatusChangert model', function() {
	let instance;
	beforeEach(function () {
		instance = new PlanStatusChange();
	});

	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.plan_id).to.eql(['required', 'integer']);
		expect(rules.status).to.eql(['string']);
		expect(rules.date).to.eql(['date']);
		expect(rules.status_description).to.eql(['string' ]);
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('plan_status_change');
	});

});
