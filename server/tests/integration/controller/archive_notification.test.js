const expect = require('chai').expect;
const { mockDatabase } = require('../../mock');

describe.only('archive_notification controller', function() {
	const tables = ['archive_notification'];
	beforeEach(async function() {
		// await mockDatabase.dropTables(tables);
		await mockDatabase.createTables(tables);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('creates row in db successfuly', async function() {
		const { ArchiveNotificationController } = require('../../../api/controller');
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
		const {attributes} = await ArchiveNotificationController.create(req);
		expect(attributes.person_id).to.eql(req.body.person_id);
		expect(attributes.plan_id).to.eql(req.body.plan_id);
		expect(attributes.type).to.eql(req.body.type);
		expect(attributes.seen).to.eql(0);
	});
});

// const tablesData = {
// 	archive_notification: [{
// 		plan_id: '123',
// 		person_id: '435',
// 		created_at: new Date(),
// 		updated_at: new Date()
// 	},
// 	{
// 		plan_id: '135',
// 		person_id: '325',
// 		created_at: new Date(),
// 		updated_at: new Date()
// 	}]
// };

// await mockDatabase.insertData(tables, tablesData);