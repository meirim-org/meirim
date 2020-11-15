const expect = require('chai').expect;
// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised'); 
const sinon = require('sinon');
const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');
const Bcrypt = require('bcrypt');
const { mockDatabase } = require('../../mock');
const { fakeEmailVerification } = require('../../utils');
const Email = require('../../../api/service/email');
const	signController = require('../../../api/controller/sign');
const	personModel = require('../../../api/model/person');
// const	Exception = require('../../api/model/exception');
// chai.use(chaiAsPromised);
// const assert = chai.assert;

describe('Sign Controller - Signup' ,function() {
	this.timeout(10000);
	let sinonSandbox;
	const tables = ['person'];
	beforeEach(async function() {
		sinonSandbox = sinon.createSandbox();
		await mockDatabase.createTables(tables);
		await Email.init();
		const fakeVerifyEmail = fakeEmailVerification;
		const fakeSendEmail = sinon.fake.resolves({messageId: 'fake'});
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
		await sinonSandbox.restore();
	});

	it('User can signup successfully', async function () {
		const email = 'test5439012@meirim.org';
		const password = '123456';
		const req = {
			body: {
				email,
				password,
				status: 0,
				address: 'addre',
				about_me: 'aboutme',
				name: 'my name',
				type: 'user_type'
			},
			session: {}
		};

		const isValidEmail = await personModel.verifyEmail(email);
		const isAlreadyExist = await personModel.isUserExist(email);
		expect(isAlreadyExist).to.eql(false);
		expect(isValidEmail).to.eql(true);
		const person = await signController.signup(req);
		expect (await personModel.isUserExist(email)).to.eql(true);
		expect(person.attributes.email).to.eql(req.body.email);
		expect(person.attributes.status).to.eql(req.body.status);
		const user = personModel.forge({
			email
		});
		await user.fetch();
		const activationReq = {
			body: {
				token: user.getActivationToken()
			},
			session: {}
		};
		const activationResponse = await signController.activate(activationReq);
		const [personAfterActivation] = await mockDatabase.selectData('person', {email});

		expect(activationResponse).to.eql(true);
		expect(personAfterActivation.status).to.eql(1);
	});
});

describe('Sign Controller - Signin' , function() {
	let sinonSandbox;
	const tables = ['person'];
	const email = 'test@meirim.com';
	const password = '123456';
	beforeEach(async function() {
		sinonSandbox = sinon.createSandbox();
		await mockDatabase.createTables(tables);
		const hashedPassword = await Bcrypt.hash(password, 10).then((hashedPassword) => {
			return hashedPassword;
		});
		await mockDatabase.insertData(tables, {'person': 
			[{ 
				email,
				password: hashedPassword,
				status: 1,
				admin: 0,
				name: 'my name',
				type: 'user_type',
				created_at: new Date(Date.now()), 
				updated_at: new Date(Date.now()), 
			}]
		});
		await Email.init();
		const fakeVerifyEmail = fakeEmailVerification;
		const fakeSendEmail = sinon.fake.resolves({messageId: 'fake'});
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
		await sinonSandbox.restore();
	});

	it('User can signin successfully', async function () {
		console.log('hello world');
		const req = {
			body: {
				email,
				password
			},
			session: {}
		};

		const { attributes } = await signController.signin(req);
		expect(attributes.email).to.eql(email);
		expect(attributes.id).to.eql(1);
		expect(attributes.status).to.eql(1);
	});

	it('sign in should work with uppercase email', async function() {
		const req = {
			body: {
				email: email.toUpperCase(),
				password
			},
			session: {}
		};

		const { attributes } = await signController.signin(req);
		expect(attributes.email).to.eql(email);
		expect(attributes.id).to.eql(1);
		expect(attributes.status).to.eql(1);
	});

});

describe('Sign Controller - Signout' , function() {
	let sinonSandbox;
	const tables = ['person'];
	const email = 'test@meirim.com';
	const password = '123456';
	beforeEach(async function() {
		sinonSandbox = sinon.createSandbox();
		await mockDatabase.createTables(tables);
		const hashedPassword = await Bcrypt.hash(password, 10).then((hashedPassword) => {
			console.log('hashedPassword', hashedPassword);
			return hashedPassword;
		});
		await mockDatabase.insertData(tables, {'person': 
			[{ 
				email,
				password: hashedPassword,
				status: 1,
				admin: 0,
				created_at: new Date(Date.now()), 
				updated_at: new Date(Date.now()), 
			}]
		});
		await Email.init();
		const fakeVerifyEmail = fakeEmailVerification;
		const fakeSendEmail = sinon.fake.resolves({messageId: 'fake'});
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
		await sinonSandbox.restore();
	});

	it('User can signout successfully', async function () {
		const req = {
			body: {
				email,
				password
			},
			session: {}
		};

		const { attributes } = await signController.signin(req);
		expect(attributes.email).to.eql(email);
		expect(attributes.id).to.eql(1);
		expect(attributes.status).to.eql(1);
		const signoutRequest = {
			body: {},
			session: {
				destroy: () => true
			}
		};

		expect(signController.signout(signoutRequest)).to.eql(true);
	});
});

/**  Failing test do not work atm, 
need to check why mocha breaks when a test should return BadRequest response
	it.skip('sign in should fail without email', function() {
		const req = {
			body: {
				password: 'wrongPw'
			},
			session: {}
		};

		assert.throws(function() { signController.signin(req); }, Exception.BadRequest);
	});

	it.skip('sign in should fail without password', function() {
		const req = {
			body: {
				email
			},
			session: {}
		};

		assert.throws(function() { signController.signin(req); }, Exception.BadRequest);
	});


-----------
	it.skip('sign up with invalid email should fail', function() {
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

it('sign in should fail with wrong password', function() {
	const req = {
		body: {
			email,
			password: 'wrongPw'
		},
		session: {}
	};

	assert.isRejected(signController.signin(req), Exception.BadRequest);
}); **/