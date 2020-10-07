const expect = require('chai').expect;
const { ArchiveNotification } = require('../../api/model');

describe('archive_notification model', function() {
	it('has the right rules', async function() {
		const instance = new ArchiveNotification();
		const rules = instance.rules;
		expect(rules.person_id).to.eql(['required', 'integer']);
		expect(rules.plan_id).to.eql(['required', 'integer']);
		expect(rules.seen).to.eql('boolean');
		expect(rules.type).to.eql(['required', 'string' ]);
	});

	it('has the right table name', async function() {
		const instance = new ArchiveNotification();
		const tableName = instance.tableName;
		expect(tableName).to.eql('archive_notification');
	});

	it('has the right defaults', async function() {
		const instance = new ArchiveNotification();
		const defaults = instance.defaults();
		expect(defaults).to.eql({seen: false});
	});

	it('has timestamps', async function() {
		const instance = new ArchiveNotification();
		const isTimestamps = instance.hasTimestamps;
		expect(isTimestamps).to.eql(true);
	});
});