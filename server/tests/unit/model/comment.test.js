const expect = require('chai').expect;
const {Comment} = require('../../../api/model');

describe('Comment model', function () {
	let instance;
	beforeEach(function () {
		instance = new Comment();
	});

	afterEach(function () {
		instance = null;
	});

	it('has the right rules', function () {
		const rules = instance.rules;
		expect(rules.person_id).to.eql(['required', 'integer']);
		expect(rules.content).to.eql(['required', 'string']);
		expect(rules.plan_id).to.eql(['required', 'integer']);
		expect(rules.parent_id).to.eql(['required', 'integer']);
	});

	it('has the right table name', function () {
		const tableName = instance.tableName;
		expect(tableName).to.eql('comment');
	});

	it('is a member of Person model', function () {
		const person = instance.person();
		expect(person.constructor.name).to.eql('Person');
	});

});
