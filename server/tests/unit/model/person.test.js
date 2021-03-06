
const expect = require('chai').expect;
const { Person } = require('../../../api/model');

describe('Person model', function() {
	let instance;
	beforeEach(function () {
		instance = new Person();
	}); 
	
	afterEach(function() {
		instance = null;
	});
	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.email).to.eql(['required', 'email']);
		expect(rules.password).to.eql(['required', 'string']);
		expect(rules.name).to.eql(['required', 'string']);
		expect(rules.type).to.eql(['required', 'string']);
		expect(rules.social_network_url).to.eql('string');
		expect(rules.about_me).to.eql('string');
		expect(rules.status).to.eql(['required','integer']);
		expect(rules.admin).to.eql(['integer']);
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('person');
	});

	it('has the right defaults', function() {
		const defaults = instance.defaults;
		expect(defaults).to.eql({ status: 0 });
	});

	it('has timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(true);
	});
});