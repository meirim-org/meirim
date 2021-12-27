const expect = require('chai').expect;
const { mockDatabase } = require('../../mock');
const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');
const Email = require('../../../api/service/email');
const { wait } = require('../../utils');
const sinon = require('sinon');
const { AlertController  } = require('../../../api/controller');
const { Plan } = require('../../../api/model');

describe('notification controller', function() {
	const tables = ['notification'];
	beforeEach(async function() {
		await mockDatabase.createTables(tables);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('creates row in db successfuly', async function() {
		const { NotificationController } = require('../../../api/controller');
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
		const { attributes } = await NotificationController.create(req);
		expect(attributes.person_id).to.eql(req.body.person_id);
		expect(attributes.plan_id).to.eql(req.body.plan_id);
		expect(attributes.type).to.eql(req.body.type);
		expect(attributes.seen).to.eql(0);
	});
});

describe('Notification model integration with different models', function() {
	this.timeout(10000);
	const sinonSandbox = sinon.createSandbox();
	const tables = ['person', 'alert', 'plan', 'notification'];
	const person = {
		email: 'test@meirim.org',
		password: 'xxxx',
		status: 1,
		id: 1,	
	};
	const geom ={
		'type': 'FeatureCollection',
		'features': [
			{
				'type': 'Feature',
				'properties': {},
				'geometry': {
					'type': 'Polygon',
					'coordinates': [
						[
							[
								34.76991534233093,
								32.05974580128699
							],
							[
								34.7698187828064,
								32.059591226352595
							],
							[
								34.76977586746216,
								32.059363909798144
							],
							[
								34.77029085159302,
								32.059409373154224
							],
							[
								34.76991534233093,
								32.05974580128699
							]
						]
					]
				}
			}
		]
	};

	beforeEach(async function() {
		await mockDatabase.createTables(tables);
		await mockDatabase.insertData(['person'], { 'person': [person] });
		await Email.init();
		const fakeVerifyEmail = sinon.fake(function(email, options, cb) {
			cb(null, { success: true, code: 1, banner: 'string' });
		});
		const fakeSendEmail = sinon.fake.resolves({ messageId: 'fake' });
		sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
		sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
		await sinonSandbox.restore();
	});

	it('creates notification for a user based on subscribed area ', async function() {
		const req = {
			body: {
				address: 'מטלון 18 תל אביב',
				radius: '20'
			},
			session: {
				person
			}
		};
		await AlertController.create(req);
		const iPlan = {
			properties : 
				{
					OBJECTID: 4,
					PLAN_COUNTY_NAME: 'COUNTNAME',
					PL_NUMBER: 'plannumber',
					PL_NAME: 'planname',
					data: 'data',
					PL_URL: 'plurl',
					STATION_DESC: '50'
				},
			geometry: geom
		};
		await Plan.buildFromIPlan(iPlan);
		await wait(1);
		const notifications = await mockDatabase.selectData('notification', {	plan_id: 1	});
		expect(notifications.length).to.eql(1);
		expect(notifications[0].type).to.eql('NEW_PLAN_IN_AREA');
		expect(notifications[0].person_id).to.eql(1);
		expect(notifications[0].seen).to.eql(0);
	});

	it('Adds a row in notification table for updated plan', async function() {
		const req = {
			body: {
				address: 'מטלון 18 תל אביב',
				radius: '20'
			},
			session: {
				person
			}
		};
		await AlertController.create(req);
		const iPlan = {
			properties : 
				{
					OBJECTID: 4,
					PLAN_COUNTY_NAME: 'COUNTNAME',
					PL_NUMBER: 'plannumber',
					PL_NAME: 'planname',
					data: 'data',
					PL_URL: 'plurl',
					STATION_DESC: '50'
				},
			geometry: geom
		};
		await Plan.buildFromIPlan(iPlan);
		const plan = await Plan.forge({ PL_NUMBER: iPlan.properties.PL_NUMBER }).fetch();

		const noti1 = await mockDatabase.selectData('notification', {	plan_id: 1	});
		expect(noti1.length).to.eql(1);
		const data = {
			OBJECTID: 1,
			PLAN_COUNTY_NAME: iPlan.properties.PLAN_COUNTY_NAME || '',
			PL_NUMBER: iPlan.properties.PL_NUMBER || '',
			PL_NAME: iPlan.properties.PL_NAME || '',
			data: iPlan.properties,
			geom: iPlan.geometry,
			PLAN_CHARACTOR_NAME: '',
			plan_url: iPlan.properties.PL_URL,
			status: '60',
		};
		await plan.set(data);
		await plan.save();
		await wait(1);
		const notifications = await mockDatabase.selectData('notification', {	plan_id: 1	});
		expect(notifications.length).to.eql(2);
		const [firstNotification, secondNotification] = notifications;
		expect(firstNotification.type).to.eql('NEW_PLAN_IN_AREA');
		expect(secondNotification.type).to.eql('STATUS_CHANGE');
	});
});