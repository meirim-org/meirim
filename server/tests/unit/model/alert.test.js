const expect = require('chai').expect;
const { Alert } = require('../../../api/model');

describe('Alert model', function() {
	let instance;
	beforeEach(function () {
		instance = new Alert();
	});

	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.person_id).to.eql(['required', 'integer']);
		expect(rules.address).to.eql(['string']);
		expect(rules.geom).to.eql(['object']);
		expect(rules.radius).to.eql(['string' ]);
		expect(rules.place).to.eql(['string']);
		expect(rules.type).to.eql(['string']);
		expect(rules.subscription).to.eql(['required', 'integer']);
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('alert');
	});

	it('has the right defaults', function() {
		const defaults = instance.defaults();
		expect(defaults).to.eql({ radius: '4', type: 'plan', subscription: 1 });
	});

	it('has the right geometry', function() {
		const defaults = instance.geometry;
		expect(defaults).to.eql(['geom']);
	});

});
