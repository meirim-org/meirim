const assert = require('chai').assert;

const ArchiveNotificationSeed = function(t) {
	t.increments();
	t.integer('plan_id'); // temp
	t.integer('person_id');
};

const getMockDatabase = () => {
	let mock = undefined;
	
	if(!mock){
		const { mockDatabase } = require('../mock');
		mock = mockDatabase;
	}
	return mock;
};
const tables = [ 'archive_notification' ];
const seeders = [ArchiveNotificationSeed];

describe('init', function() {

	beforeEach(async function() {
		const mockDatabase = getMockDatabase(); 
		await mockDatabase.seed(tables, seeders);
	});

	afterEach(async function() {
		const mockDatabase = getMockDatabase();
		await mockDatabase.truncate(tables);
	});

	it('first', async function() {
		const { ArchiveNotification } = require('../../api/model');
		const {ArchiveNotificationController} = require('../../api/controller');
		const req = {
			session: {
				person: 'fake'
			},
			body: {
				person_id: '123',
				plan_id: '123',
			}
		};
		const res = await ArchiveNotificationController.create(req);
		
		const n = new ArchiveNotification({a: '3'});
		// assert.equal(n.rules.name, 'string');
	});
});