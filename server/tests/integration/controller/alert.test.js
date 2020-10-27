const assert = require('chai').assert;
const sinon = require('sinon');
const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');
const {	mockDatabase } = require('../../mock');
const alertController = require('../../../api/controller/alert');
const Email = require('../../../api/service/email');

describe.only('Alert controller', function() {
	const sinonSandbox = sinon.createSandbox();
	const tables = ['person', 'alert', 'plan', 'notification'];
	const person = {
		email: 'test@meirim.org',
		password: 'xxxx',
		status: 1,
		id: 1,	
	};

	beforeEach(async function() {
		// await mockDatabase.dropTables(tables);
		await mockDatabase.createTables(tables);
		await mockDatabase.insertData(['person'], {'person': [person]});
		await Email.init();
		const fakeVerifyEmail = sinon.fake(function(email, options, cb) {
			cb(null, {success: true, code: 1, banner: 'string'});
		});
		const fakeSendEmail = sinon.fake.resolves({messageId: 'fake'});
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
		await sinonSandbox.restore();
	});

	it('Create alert should work', async function() {
		this.timeout(10000);
		const req = {
			body: {
				address: 'ben yehuda 32 tel aviv'
			},
			session: {
				person
			}
		};
		const alert = await alertController.create(req);

		assert.isOk(alert);
	});
});
