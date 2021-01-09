const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mockDatabase } = require('../../mock');
const Exception = require('../../../api/model/exception');

chai.use(chaiAsPromised);
const assert = chai.assert;

describe('Funding controller', function() {
	const tables = ['funding_transaction'];

	beforeEach(async function() {
		await mockDatabase.createTables(tables);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('creates row in db successfuly', async function() {
		const { FundingController } = require('../../../api/controller');
		const { FundingTransaction } = require('../../../api/model');

		// create should be successful for logged-in user
		const req = {
			session: {
				person: {
					id: 1
				} 
			},
			body: {
				yaad_id: 1,
				recurring: false,
				amount: 100
			}
		};
		const res = await FundingController.create(req);
		assert.equal(res, true, 'create response is true');

		// create should be successful for guest user
		const req2 = {
			session: {},
			body: {
				yaad_id: 2,
				recurring: true,
				amount: 50
			}
		};
		const res2 = await FundingController.create(req2);
		assert.equal(res2, true, 'create response is true');

		// fetch all existing transactions to make sure saved data is correct
		const existingTransactions = await FundingTransaction.fetchAll();
		assert.equal(existingTransactions.models[0].attributes.yaad_id, 1, 'created yaad id value is correct');
		assert.equal(existingTransactions.models[0].attributes.recurring, false, 'created recurring value is correct');
		assert.equal(existingTransactions.models[0].attributes.amount, 100, 'created amount value is correct');
		assert.equal(existingTransactions.models[1].attributes.yaad_id, 2, 'created yaad id value is correct');
		assert.equal(existingTransactions.models[1].attributes.recurring, true, 'created recurring value is correct');
		assert.equal(existingTransactions.models[1].attributes.amount, 50, 'created amount value is correct');

		// create should not work for existing yaad id or with partial data
		const req3 = {
			session: {},
			body: {
				yaad_id: 3,
				recurring: false
			}
		};
		assert.isRejected(FundingController.create(req3), Exception.BadRequest, 'No amount provided');
		const req4 = {
			session: {},
			body: {
				yaad_id: 3,
				amount: 50
			}
		};
		assert.isRejected(FundingController.create(req4), Exception.BadRequest, 'No recurring provided');
		const req5 = {
			session: {},
			body: {
				recurring: false,
				amount: 50
			}
		};
		assert.isRejected(FundingController.create(req5), Exception.BadRequest, 'No yaad_id provided');
		const req6 = {
			session: {},
			body: {
				yaad_id: 2,
				recurring: false,
				amount: 150
			}
		};
		assert.isRejected(FundingController.create(req6), 'ER_DUP_ENTRY');
	});

	it('get funding stats', async function() {
		const { FundingController } = require('../../../api/controller');

		// when no transactions exist totalAmount should be 0
		const req = {
			session: {},
			body: {}
		};
		const res = await FundingController.getFundingStats(req);
		assert.deepEqual(res, {totalAmount: 0, count: 0}, 'create response is true');

		// create non-recurring transactions
		const req2 = {
			session: {},
			body: {
				yaad_id: 1,
				recurring: false,
				amount: 50
			}
		};
		const res2 = await FundingController.create(req2);
		assert.equal(res2, true, 'create response is true');

		const req3 = {
			session: {},
			body: {
				yaad_id: 2,
				recurring: false,
				amount: 100
			}
		};
		const res3 = await FundingController.create(req3);
		assert.equal(res3, true, 'create response is true');

		const req4 = {
			session: {},
			body: {
				yaad_id: 3,
				recurring: false,
				amount: 150
			}
		};
		const res4 = await FundingController.create(req4);
		assert.equal(res4, true, 'create response is true');

		// when transactions exist totalAmount should sum them
		const res5 = await FundingController.getFundingStats(req);
		assert.deepEqual(res5, {totalAmount: 300, count: 3}, 'create response is true');

		// create recurring transactions
		const req6 = {
			session: {},
			body: {
				yaad_id: 4,
				recurring: true,
				amount: 50
			}
		};
		const res6 = await FundingController.create(req6);
		assert.equal(res6, true, 'create response is true');

		const req7 = {
			session: {},
			body: {
				yaad_id: 5,
				recurring: true,
				amount: 100
			}
		};
		const res7 = await FundingController.create(req7);
		assert.equal(res7, true, 'create response is true');

		// recurring transactions should count the same as non-recurring ones towards the amount sum
		const res8 = await FundingController.getFundingStats(req);
		assert.deepEqual(res8, {totalAmount: 450, count: 5}, 'create response is true');
	});
});