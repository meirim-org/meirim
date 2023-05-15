const assert = require('chai').assert;
const sinon = require('sinon');
const nock = require('nock');
const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');
const { mockDatabase } = require('../../mock');
const Email = require('../../../api/service/email');
const signController = require('../../../api/controller/sign');
const alertController = require('../../../api/controller/alert');
const cronController = require('../../../api/controller/cron');
const planModel = require('../../../api/model/plan');
const { fakeEmailVerification } = require('../../utils');
const planPersonModel = require('../../../api/model/plan_person');
const puppeteerBrowser = require('puppeteer/lib/cjs/puppeteer/common/Browser').Browser;
const requestPromise = require('request-promise');
const { wait } = require('../../utils');

describe('Emails', function() {

	const tables = ['alert', 'person', 'plan', 'notification', 'plan_person', 'plan_status_change', 'status_mapping'];
	let sinonSandbox;

	beforeEach(async function() {
		await mockDatabase.createTables(tables);

		const status_mapping1 = 
		[
			{ mavat_status:'הוגשו התנגדויות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'החלטה בדיון בהתנגדויות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'העברה להערות / תגובות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'התכנית פורסמה להערות והשגות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'התכנית פורסמה להתנגדויות לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'התקבלו הערות / תגובות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'לא הוגשו התנגדויות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'פרסום להפקדה בעיתונים', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'פרסום להפקדה בעיתונים לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'פרסום להפקדה ברשומות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'פרסום להפקדה ברשומות לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'פרסום נוסח ההפקדה על גבי שלט בתחום התכנית', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'פרסום נוסח ההפקדה על גבי שלט בתחום התכנית לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'פרסום נוסח הודעה בדבר הפקדת תכנית באתר אינטרנט', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'רישום נתוני פרסום בעיתונות על העברה להערות והשגות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'רישום נתוני פרסום ברשומות על העברה להערות והשגות', meirim_status: 'התנגדויות והערות הציבור' },
			{ mavat_status:'תיקון התכנית לקראת פרסום לפי סעיף 106 ב', meirim_status: 'התנגדויות והערות הציבור' },
		];
		await mockDatabase.insertData(['status_mapping'], { 'status_mapping': [status_mapping1] });

		const fakeVerifyEmail = fakeEmailVerification; 
		const fakeSendEmail = sinon.fake.resolves({ messageId: 'fake'  });

		sinonSandbox = sinon.createSandbox();
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
		await Email.init();
		const newPageStub = sinonSandbox.stub(puppeteerBrowser.prototype, 'newPage').callsFake(
			sinonSandbox.fake(async () => {
				// create a new page using the original function
				const newPage = await newPageStub.wrappedMethod.call(newPageStub.thisValues[0]);

				// this is required for us to be able to respond with custom responses
				await newPage.setRequestInterception(true);

				// register the event handler
				newPage.on('request', (request) => {
					const options = {
						gzip: true,  // allow both gzipped and non-gzipped responses
						url: request.url(),
						method: request.method(),
						headers: request.headers(),
						body: request.postData()
					};

					// use request-promise (which uses the http/https modules) to actually
					// make the request. if the request matches a nock rule the response
					// will be mocked
					requestPromise(options, (err, response, body) => {
						if (err) {
							request.abort(500);
						} else {
							request.respond({
								status: response.statusCode,
								headers: response.headers,
								body: body
							});
						}
					});
				});

				// return the new page with the registered event handler
				return newPage;
			})
		);
		// make sure nock is active
		if (!nock.isActive())
			nock.activate();
	});

	afterEach(async function() {
		nock.restore();
		await sinonSandbox.restore();
		await wait(3);
		await mockDatabase.dropTables(tables);
	});

	it('should send notifications to users with alerts intersecting a new plan', async function() {
		this.timeout(60000);

		// user emails for our two test users
		const firstUserEmail = 'testfirstuser@meirim.org';
		const secondUserEmail = 'testseconduser@meirim.org';

		// create the first user
		const firstUserReq = createUser(firstUserEmail);
		const firstPerson = await signController.signup(firstUserReq);

		assert.equal(firstPerson.attributes.email, firstUserEmail, 'person email should match provided value');
		assert.equal(firstPerson.attributes.status, 0, 'person status should be waiting for activation');
		assert.isAtLeast(firstPerson.id, 0, 'a person id should have been generated');

		// activation email was "sent"
		assert.equal(Mailer.prototype.sendMail.callCount, 1, 'sendMail should have been called once to activate the new user');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, firstUserEmail, 'sendMail should have been called to send to the new user\'s email');

		// activate the first user so it can recieve plan notifications
		await activateUser(firstUserReq);

		// create the second user
		const secondUserReq = createUser(secondUserEmail);
		const secondPerson = await signController.signup(secondUserReq);

		assert.equal(secondPerson.attributes.email, secondUserEmail, 'person email should match provided value');
		assert.equal(secondPerson.attributes.status, 0, 'person status should be waiting for activation');
		assert.isAtLeast(secondPerson.id, 0, 'a person id should have been generated');

		// activation email was "sent"
		assert.equal(Mailer.prototype.sendMail.callCount, 2, 'sendMail should have been called again to activate the new user');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, secondUserEmail, 'sendMail should have been called to send to the new user\'s email');

		// activate the second user so it can recieve plan notifications
		await activateUser(secondUserReq);

		// NOTE: geocoder responses are not mocked for now. if in the 
		// future the service returns inconsistent responses or becomes 
		// unreliable this can be changed

		// set up an alert for the first user
		const firstUserAlertReq = createUserAlertReq('מואב 59 ערד', firstUserReq.session.person.attributes);
		const firstAlert = await alertController.create(firstUserAlertReq);

		assert.equal(firstAlert.attributes.person_id, firstPerson.id, 'alert person id should match created person id');
		assert.isAtLeast(firstAlert.id, 0, 'an alert id should have been generated');

		// new alert email was "sent"
		assert.equal(Mailer.prototype.sendMail.callCount, 3, 'sendMail should have been called once to notify the user of the new alert');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, firstUserEmail, 'sendMail should have been called to send to the user\'s email');

		// set up an alert for the second user
		const secondUserAlertReq = createUserAlertReq('קניון ערד', secondUserReq.session.person.attributes);
		const secondAlert = await alertController.create(secondUserAlertReq);

		assert.equal(secondAlert.attributes.person_id, secondPerson.id, 'alert person id should match created person id');
		assert.isAtLeast(secondAlert.id, 0, 'an alert id should have been generated');

		// new alert email was "sent"
		assert.equal(Mailer.prototype.sendMail.callCount, 4, 'sendMail should have been called once to notify the user of the new alert');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, secondUserEmail, 'sendMail should have been called to send to the user\'s email');

		// create a new plan which does not intersect with the two alerts -
		// use buildFromIPlan instead of just creating and instance and 
		// saving it to utilize as many used functions as possible. can be 
		// changed in the future
		const firstIPlan = createPlan(1, 'תוכנית 1', '1-1', '456456', getCoordP1());
		await planModel.buildFromIPlan(firstIPlan);

		// run send planning alerts cron job
		await cronController.sendPlanningAlerts();

		// no emails should have been sent
		assert.equal(Mailer.prototype.sendMail.callCount, 4, 'sendMail should not have been called since no user is subscribed to this location');

		// create a new plan which intersects with the first user's alert
		const secondIPlan = createPlan(2, 'תוכנית 2', '2-1', '123123', getCoordP2());
		await planModel.buildFromIPlan(secondIPlan);

		// run send planning alerts cron job
		await cronController.sendPlanningAlerts();

		// the first user should have been notified
		assert.equal(Mailer.prototype.sendMail.callCount, 5, 'sendMail should have been called once to notify the first user of a new plan');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, firstUserEmail, 'sendMail should have been called to send to the user\'s email');

		// create a new plan which intersects with the second user's alert
		const thirdIPlan = createPlan(3, 'תוכנית 3', '3-1', '456456', getCoordP3());
		await planModel.buildFromIPlan(thirdIPlan);

		// run send planning alerts cron job
		await cronController.sendPlanningAlerts();

		// the second user should have been notified
		assert.equal(Mailer.prototype.sendMail.callCount, 6, 'sendMail should have been called once to notify the second user of a new plan');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, secondUserEmail, 'sendMail should have been called to send to the user\'s email');

		// create a new plan which intersects with the both users' alerts
		const fourthIPlan = createPlan(4, 'תוכנית 4', '4-1', '456456', getCoordP4());
		await planModel.buildFromIPlan(fourthIPlan);

		// run send planning alerts cron job
		await cronController.sendPlanningAlerts();

		// both users should have been notified
		assert.equal(Mailer.prototype.sendMail.callCount, 8, 'sendMail should have been called twice to notify both users of a new plan');

		// make sure both users were notified (order is not guaranteed) (call ids are zero-based)
		const seventhCallTo = Mailer.prototype.sendMail.getCall(6).args[0].to;
		const eighthCallTo = Mailer.prototype.sendMail.getCall(7).args[0].to;
		assert.isTrue(
			(seventhCallTo === firstUserEmail && eighthCallTo === secondUserEmail) || 
      (seventhCallTo === secondUserEmail && eighthCallTo === firstUserEmail),
			'sendMail should have been called to send to the user\'s email'
		);
	});

	it('should send notifications to users on plan deposit', async function() {
		this.timeout(60000);

		// user emails for our two test users
		const firstUserEmail = 'testfirstuser@meirim.org';
		const secondUserEmail = 'testseconduser@meirim.org';

		// create the first user
		const firstUserReq = createUser(firstUserEmail);
		await signController.signup(firstUserReq);

		// activation email was "sent"
		assert.equal(Mailer.prototype.sendMail.callCount, 1, 'sendMail should have been called once to activate the new user');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, firstUserEmail, 'sendMail should have been called to send to the new user\'s email');


		// create the second user
		const secondUserReq = createUser(secondUserEmail);
		const secondPerson = await signController.signup(secondUserReq);

		// activation email was "sent"
		assert.equal(Mailer.prototype.sendMail.callCount, 2, 'sendMail should have been called again to activate the new user');
		assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, secondUserEmail, 'sendMail should have been called to send to the new user\'s email');

		// activate second user
		await activateUser(secondUserReq);

		// create first plan
		const firstIPlan = createPlan(1, 'תוכנית 1', '1-1', '5000878739', getCoordP1());
		const firstIPlanDb = await planModel.buildFromIPlan(firstIPlan);

		// create second plan
		const secondIPlan = createPlan(2, 'תוכנית 2', '2-1', '1005184392', getCoordP2());
		const secondIPlanDb = await planModel.buildFromIPlan(secondIPlan);

		// subscribe to both plans for second user
		planPersonModel.subscribe (secondPerson.id, firstIPlanDb.id);
		planPersonModel.subscribe (secondPerson.id, secondIPlanDb.id);
	
		// first plan return status data
		const newMavatScope = nock('https://mavat.iplan.gov.il', { allowUnmocked: true })
			.persist()
			.get('/rest/api/SV4/1/?mid=5000878739')
		// actual reply copied from a browser performing the API response
			.replyWithFile(
				200,
				`${__dirname}/files/new_mavat_plan_json_page.html`,
				{ 'Content-Type': 'text/html' }
			);

		// second plan return status data
		const newMavatScopeNotDone = nock('https://mavat.iplan.gov.il', { allowUnmocked: true })
			.get('/rest/api/SV4/1/?mid=1005184392')
		// actual reply copied from a browser performing the API response
			.replyWithFile(
				200,
				`${__dirname}/files/new_mavat_plan_json_page_start.html`,
				{ 'Content-Type': 'text/html' }
			);

		// run get plan status
		await cronController.fetchPlanStatus();

		// stop nock
		newMavatScope.done();
		newMavatScopeNotDone.done();

		// test 2nd user notify on plan status - only 1 email sent
		assert.equal(Mailer.prototype.sendMail.callCount, 3, 'sendMail should have been called once to notify user of a new plan status');
		const thirdCallTo = Mailer.prototype.sendMail.getCall(2).args[0].to;
		assert.isTrue(
			(thirdCallTo === secondUserEmail),
			'sendMail should have been called to send to the user\'s email'
		);
	});

	function createPlan(planId, planName, planNumber, mpId, coord) {
		return {
			properties: {
				OBJECTID: planId,
				PLAN_COUNTY_NAME: 'ערד',
				PL_NUMBER: planNumber,
				MP_ID: mpId,
				PL_NAME: planName,
				PL_URL: 'http://url',
				STATION_DESC: 'מאושרות'
			},
			geometry: {
				type: 'Polygon',
				coordinates: coord
			}
		};
	}

	function getCoordP1() {
		return [
			[
				[35.221261,31.247297],
				[35.221261,31.247298],
				[35.221262,31.247298],
				[35.221262,31.247297],
				[35.221261,31.247297]
			]
		];
	}

	function getCoordP2() {
		return [
			[
				[35.225633,31.261314],
				[35.225633,31.261315],
				[35.225634,31.261315],
				[35.225634,31.261314],
				[35.225633,31.261314]
			]
		]
		;
	}

	function getCoordP3() {
		return [
			[
				[35.203587,31.258455],
				[35.203588,31.258455],
				[35.203588,31.258456],
				[35.203587,31.258456],
				[35.203587,31.258455]
			]
		]
		;
	}

	function getCoordP4() {
		return [
			[
				[35.217876,31.261879],
				[35.217877,31.261879],
				[35.217877,31.261880],
				[35.217876,31.261880],
				[35.217876,31.261879]
			]
		]
		;
	}

	function createUser(userEmail) {
		return {
			body: {
				email: userEmail,
				password: '1234',
				status: 0,
				name: 'my name',
				type: '0'
			},
			session: {}
		};
	}

	async function activateUser(userReq) {
		const secondUserActivationReq = {
			body: {
				token: userReq.session.person.getActivationToken()
			},
			session: {}
		};
		await signController.activate(secondUserActivationReq);
	}

	function createUserAlertReq (addressStr, personAttr) {
		return { 
			body: {
				address: addressStr,
				radius: '1'
			},
			session: {
				person: personAttr
			}
		};
	}
});
