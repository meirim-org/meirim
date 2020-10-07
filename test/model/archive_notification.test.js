const assert = require('chai').assert;

const ArchiveNotificationSeed = function(t) {
	t.increments();
	t.integer('plan_id');
	t.integer('person_id');
	t.timestamps();
};

const getMockDatabase = () => {
	let mock = undefined;
	
	if(!mock){
		const { mockDatabase } = require('../mock');
		mock = mockDatabase;
	}
	return mock;
};

const tables = ['archive_notification'];
const seeders = [ArchiveNotificationSeed];

describe('init', function() {

	beforeEach(async function() {
		const mockDatabase = getMockDatabase(); 
		await mockDatabase.truncate(tables);
		await mockDatabase.seed(tables, seeders);
	});

	afterEach(async function() {
		const mockDatabase = getMockDatabase();
		await mockDatabase.truncate(tables);
	});

	it('first', async function() {
		const {ArchiveNotificationController} = require('../../api/controller');
		const req = {
			session: {
				person: 'fake'
			},
			body: {
				person_id: 123,
				plan_id: 123,
			}
		};

		 await ArchiveNotificationController.create(req);
	});
});