const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');
const { mockDatabase } = require('../mock');

chai.use(chaiAsPromised);
const assert = chai.assert;
const sinonSandbox = sinon.createSandbox();
let tables = ['person'];
describe('Sign controller', function() {
	let signController;
	let personModel;
	let Exception;

	const email = `test${new Date().getTime()}@meirim.org`;
	const password = '123456';

	this.timeout(10000);

	before(async function() {
		// require here so database instance is not initiated before we override config values
		await mockDatabase.dropTables(tables);
		await mockDatabase.createTables(tables);
		signController = require('../../api/controller/sign');
		Exception = require('../../api/model/exception');
		personModel = require('../../api/model/person');

		// init email service to load email templates
		const Email = require('../../api/service/email');
		await Email.init();

		// mock email-verify and nodemailer so we can fake-send emails
		const fakeVerifyEmail = sinon.fake(function(email, options, cb) {
			// allow only @meirim.org email addresses
			if (email && email.toLowerCase().endsWith('@meirim.org')) {
				cb(null, {success: true, code: 1, banner: 'string'});
			} else {
				// one of the possible error outcomes of email validation
				const domain = email.split(/[@]/).splice(-1)[0].toLowerCase();
				cb(new Error(`queryMx ENOTFOUND ${domain}`), {success: false, code: 5});
			}
		});
		const fakeSendEmail = sinon.fake.resolves({messageId: 'fake'});
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
	});

	after(async function() {
		await mockDatabase.dropTables(tables);
		sinonSandbox.restore();
	});

	it('sign up should work', async function() {
		const req = {
			body: {
				email,
				password,
				status: 1
			},
			session: {}
		};

		const person = await signController.signup(req);

		assert.isOk(person);
		assert.equal(person.get('email'), req.body.email);
		assert.equal(person.get('firstName'),undefined);
		assert.equal(person.get('lastName'), undefined);
		assert.deepEqual(req.session.person, person);
	});

	it('sign up with invalid email should fail', function() {
		const req = {
			body: {
				email: 'wrong@emaildns',
				password
			},
			session: {}
		};

		let sendEmailCallCount = Mailer.prototype.sendMail.callCount;

		assert.isRejected(signController.signup(req), Exception.BadRequest);

		// make sure we didn't try to send an email to an invalid address
		assert.equal(Mailer.prototype.sendMail.callCount, sendEmailCallCount, 'sendMail should not have been called for an invalid email');
	});

	it('activate account should work', async function() {
		let user = personModel.forge({
			email,
		});

		await user.fetch();

		const req = {
			body: {
				token: user.getActivationToken()
			},
			session: {}
		};
  
		const response = await signController.activate(req);

		assert.isOk(response);
	});

	it('sign in should work', async function() {
		const req = {
			body: {
				email,
				password
			},
			session: {}
		};

		const response = await signController.signin(req);

		assert.isOk(response);
		assert.isOk(req.session.person);
	});

	it('sign in should work with uppercase email', async function() {
		const req = {
			body: {
				email: email.toUpperCase(),
				password
			},
			session: {}
		};

		const response = await signController.signin(req);

		assert.isOk(response);
		assert.isOk(req.session.person);
	});

	it('sign in should fail with wrong password', function() {
		const req = {
			body: {
				email,
				password: 'wrongPw'
			},
			session: {}
		};

		assert.isRejected(signController.signin(req), Exception.BadRequest);
	});

	it('sign in should fail without email', function() {
		const req = {
			body: {
				password: 'wrongPw'
			},
			session: {}
		};

		assert.throws(function() { signController.signin(req); }, Exception.BadRequest);
	});

	it('sign in should fail without password', function() {
		const req = {
			body: {
				email
			},
			session: {}
		};

		assert.throws(function() { signController.signin(req); }, Exception.BadRequest);
	});

	it('sign out should work', function() {
		const req = {
			body: {},
			session: {
				destroy: () => true
			}
		};

		assert.isOk(signController.signout(req));
	});
});
