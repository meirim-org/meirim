const assert = require('chai').assert;
const sinon = require('sinon');
const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');
const {	mockDatabase } = require('../mock');

let sinonSandbox = sinon.createSandbox();
const tables = ['person', 'alert'];

describe('Alert controller', function() {
	let alertController;

	let person = {
		email: 'test@meirim.org',
		password: 'xxxx',
		id: 1,	
	};

	beforeEach(async function() {

		await mockDatabase.dropTables(tables);
		await mockDatabase.createTables(tables);
		await mockDatabase.insertData(['person'], {'person': [person]});
		alertController = require('../../api/controller/alert');

		// init email service to load email templates
		const Email = require('../../api/service/email');
		await Email.init();

		// mock email-verify and nodemailer so we can 
		// fake-send emails and tell when and with what 
		// arguments these emails were "sent"
		const fakeVerifyEmail = sinon.fake(function(email, options, cb) {
			cb(null, {success: true, code: 1, banner: 'string'});
		});
		const fakeSendEmail = sinon.fake.resolves({messageId: 'fake'});
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
	});

	afterEach(function() {
		mockDatabase.dropTables(tables);
		sinonSandbox.restore();
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
