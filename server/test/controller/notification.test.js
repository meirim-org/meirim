const expect = require('chai').expect;
const { mockDatabase } = require('../mock');

const tables = ['notification'];
describe('notification controller', function() {
	beforeEach(async function() {
		await mockDatabase.dropTables(tables);
		await mockDatabase.createTables(tables);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('creates row in db successfuly', async function() {
		const {NotificationController} = require('../../api/controller');
		const req = {
			session: {
				person: { 
					id: 1 
				} 
			},
			body: {
				person_id: 1,
				plan_id: 123,
				type: 'type',
			}
		};
		const {attributes} = await NotificationController.create(req);
		expect(attributes.person_id).to.eql(req.body.person_id);
		expect(attributes.plan_id).to.eql(req.body.plan_id);
		expect(attributes.type).to.eql(req.body.type);
		expect(attributes.seen).to.eql(0);
	});
});