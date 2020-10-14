const assert = require('chai').assert;
const sinon = require('sinon');

const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');

let sinonSandbox = sinon.createSandbox();

describe('Alert controller', function() {
	let alertController;
	let personModel;

	let person, alert;

	before(async function() {
		alertController = require('../../api/controller/alert');
		personModel = require('../../api/model/person');

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

	after(function() {
		sinonSandbox.restore();
	});

	beforeEach(function() {
		person = personModel.forge({
			email: 'test@meirim.org',
			password: 'xxxx',
			id: 1,
		});
	});

	afterEach(async function() {
		// delete test objects (person is never saved so need not be destroyed)
		if (alert)
			await alert.destroy({require: true});
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

		alert = await alertController.create(req);

		assert.isOk(alert);
	});
});
