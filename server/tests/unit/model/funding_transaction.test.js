const expect = require('chai').expect;
const { FundingTransaction } = require('../../../api/model');

describe('funding_transaction model', function() {
	let instance;

	beforeEach(function () {
		instance = new FundingTransaction();
	}); 

	afterEach(function() {
		instance = null;
	});

	it('has the right rules', function() {
		const rules = instance.rules;
		expect(rules.yaad_id).to.eql(['required', 'integer']);
		expect(rules.hk_id).to.eql('integer');
		expect(rules.amount).to.eql(['required', 'integer' ]);
	});

	it('has the right table name', function() {
		const tableName = instance.tableName;
		expect(tableName).to.eql('funding_transaction');
	});

	it('has timestamps', function() {
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(true);
	});

	it('has requireFetch', function() {
		const requireFetch = instance.requireFetch;
		expect(requireFetch).to.eql(true);
	});
});
