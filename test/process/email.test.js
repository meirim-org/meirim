const assert = require('chai').assert;
const sinon = require('sinon');

const Mailer = require('nodemailer/lib/mailer');
const verifier = require('email-verify');

let sinonSandbox = sinon.createSandbox();

describe('Emails', function() {
  let signController;
  let alertController;
  let cronController;
  let planModel;

  // variables holding the models we create so we can delete them when
  // the test is over
  let firstPerson, secondPerson;
  let firstAlert, secondAlert;
  let firstPlan, secondPlan, thirdPlan, fourthPlan;

  before(async function() {
    signController = require('../../api/controller/sign');
    alertController = require('../../api/controller/alert');
    cronController = require('../../api/controller/cron');
    planModel = require('../../api/model/plan');

    // mock email-verify and nodemailer so we can 
    // fake-send emails and tell when and with what 
    // arguments these emails were "sent"
    const fakeVerifyEmail = sinon.fake(function(email, options, cb) {
      cb(null, {success: true, code: 1, banner: 'string'});
    });
    const fakeSendEmail = sinon.fake.resolves({messageId: 'fake'});
    sinonSandbox.replace(verifier, 'verify', fakeVerifyEmail);
    sinonSandbox.replace(Mailer.prototype, 'sendMail', fakeSendEmail);

    // init email service to load email templates
    const Email = require('../../api/service/email');
    await Email.init();
  });

  after(async function() {
    // delete plans
    if (firstPlan)
      await firstPlan.destroy({require: true});
    if (secondPlan)
      await secondPlan.destroy({require: true});
    if (thirdPlan)
      await thirdPlan.destroy({require: true});
    if (fourthPlan)
      await fourthPlan.destroy({require: true});

    // delete alerts
    if (firstAlert)
      await firstAlert.destroy({require: true});
    if (secondAlert)
      await secondAlert.destroy({require: true});

    // delete users
    if (firstPerson)
      await firstPerson.destroy({require: true});
    if (secondPerson)
      await secondPerson.destroy({require: true});

    sinonSandbox.restore();
  });

  it('should send notifications to users with alerts intersecting a new plan', async function() {
    this.timeout(60000);

    // user emails for our two test users
    const firstUserEmail = 'testfirstuser@meirim.org';
    const secondUserEmail = 'testseconduser@meirim.org';

    // create the first user
    const firstUserReq = {
      body: {
        email: firstUserEmail,
        password: '1234'
      },
      session: {}
    };
    firstPerson = await signController.signup(firstUserReq);

    assert.equal(firstPerson.attributes.email, firstUserEmail, 'person email should match provided value');
    assert.equal(firstPerson.attributes.status, 0, 'person status should be waiting for activation');
    assert.isAtLeast(firstPerson.id, 0, 'a person id should have been generated');

    // activation email was "sent"
    assert.equal(Mailer.prototype.sendMail.callCount, 1, 'sendMail should have been called once to activate the new user');
    assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, firstUserEmail, 'sendMail should have been called to send to the new user\'s email');

    // activate the first user so it can recieve plan notifications
    const firstUserActivationReq = {
      body: {
        token: firstUserReq.session.person.getActivationToken()
      },
      session: {}
    }
    await signController.activate(firstUserActivationReq);

    // create the second user
    const secondUserReq = {
      body: {
        email: secondUserEmail,
        password: '1234'
      },
      session: {}
    };
    secondPerson = await signController.signup(secondUserReq);

    assert.equal(secondPerson.attributes.email, secondUserEmail, 'person email should match provided value');
    assert.equal(secondPerson.attributes.status, 0, 'person status should be waiting for activation');
    assert.isAtLeast(secondPerson.id, 0, 'a person id should have been generated');

    // activation email was "sent"
    assert.equal(Mailer.prototype.sendMail.callCount, 2, 'sendMail should have been called again to activate the new user');
    assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, secondUserEmail, 'sendMail should have been called to send to the new user\'s email');

    // activate the second user so it can recieve plan notifications
    const secondUserActivationReq = {
      body: {
        token: secondUserReq.session.person.getActivationToken()
      },
      session: {}
    }
    await signController.activate(secondUserActivationReq);

    // NOTE: geocoder responses are not mocked for now. if in the 
    // future the service returns inconsistent responses or becomes 
    // unreliable this can be changed

    // set up an alert for the first user
    const firstUserAlertReq = {
      body: {
        address: 'רימון 1 ערד',
        radius: 1
      },
      session: {
        person: firstUserReq.session.person.attributes
      }
    };
    firstAlert = await alertController.create(firstUserAlertReq);

    assert.equal(firstAlert.attributes.person_id, firstPerson.id, 'alert person id should match created person id');
    assert.isAtLeast(firstAlert.id, 0, 'an alert id should have been generated');

    // new alert email was "sent"
    assert.equal(Mailer.prototype.sendMail.callCount, 3, 'sendMail should have been called once to notify the user of the new alert');
    assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, firstUserEmail, 'sendMail should have been called to send to the user\'s email');

    // set up an alert for the second user
    const secondUserAlertReq = {
      body: {
        address: 'קניון ערד',
        radius: 1
      },
      session: {
        person: secondUserReq.session.person.attributes
      }
    };
    secondAlert = await alertController.create(secondUserAlertReq);

    assert.equal(secondAlert.attributes.person_id, secondPerson.id, 'alert person id should match created person id');
    assert.isAtLeast(secondAlert.id, 0, 'an alert id should have been generated');

    // new alert email was "sent"
    assert.equal(Mailer.prototype.sendMail.callCount, 4, 'sendMail should have been called once to notify the user of the new alert');
    assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, secondUserEmail, 'sendMail should have been called to send to the user\'s email');

    // create a new plan which does not intersect with the two alerts -
    // use buildFromIPlan instead of just creating and instance and 
    // saving it to utilize as many used functions as possible. can be 
    // changed in the future
    const firstIPlan = {
      properties: {
        OBJECTID: 1,
        PLAN_COUNTY_NAME: 'ערד',
        PL_NUMBER: '1-1',
        PL_NAME: 'תוכנית 1',
        PL_URL: 'http://url',
        STATION_DESC: 'מאושרות'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              35.221261,
              31.247297
            ],
            [
              35.221261,
              31.247298
            ],
            [
              35.221262,
              31.247298
            ],
            [
              35.221262,
              31.247297
            ],
            [
              35.221261,
              31.247297
            ]
          ]
        ]
      }
    };
    firstPlan = await planModel.buildFromIPlan(firstIPlan);

    // run send planning alerts cron job
    await cronController.sendPlanningAlerts();

    // no emails should have been sent
    assert.equal(Mailer.prototype.sendMail.callCount, 4, 'sendMail should not have been called since no user is subscribed to this location');

    // create a new plan which intersects with the first user's alert
    const secondIPlan = {
      properties: {
        OBJECTID: 2,
        PLAN_COUNTY_NAME: 'ערד',
        PL_NUMBER: '2-1',
        PL_NAME: 'תוכנית 2',
        PL_URL: 'http://url',
        STATION_DESC: 'מאושרות'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              35.225633,
              31.261314
            ],
            [
              35.225633,
              31.261315
            ],
            [
              35.225634,
              31.261315
            ],
            [
              35.225634,
              31.261314
            ],
            [
              35.225633,
              31.261314
            ]
          ]
        ]
      }
    };
    secondPlan = await planModel.buildFromIPlan(secondIPlan);

    // run send planning alerts cron job
    await cronController.sendPlanningAlerts();

    // the first user should have been notified
    assert.equal(Mailer.prototype.sendMail.callCount, 5, 'sendMail should have been called once to notify the first user of a new plan');
    assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, firstUserEmail, 'sendMail should have been called to send to the user\'s email');

    // create a new plan which intersects with the second user's alert
    const thirdIPlan = {
      properties: {
        OBJECTID: 3,
        PLAN_COUNTY_NAME: 'ערד',
        PL_NUMBER: '3-1',
        PL_NAME: 'תוכנית 3',
        PL_URL: 'http://url',
        STATION_DESC: 'מאושרות'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              35.203587,
              31.258455
            ],
            [
              35.203588,
              31.258455
            ],
            [
              35.203588,
              31.258456
            ],
            [
              35.203587,
              31.258456
            ],
            [
              35.203587,
              31.258455
            ]
          ]
        ]
      }
    };
    thirdPlan = await planModel.buildFromIPlan(thirdIPlan);

    // run send planning alerts cron job
    await cronController.sendPlanningAlerts();

    // the second user should have been notified
    assert.equal(Mailer.prototype.sendMail.callCount, 6, 'sendMail should have been called once to notify the second user of a new plan');
    assert.equal(Mailer.prototype.sendMail.lastCall.args[0].to, secondUserEmail, 'sendMail should have been called to send to the user\'s email');

    // create a new plan which intersects with the both users' alerts
    const fourthIPlan = {
      properties: {
        OBJECTID: 4,
        PLAN_COUNTY_NAME: 'ערד',
        PL_NUMBER: '4-1',
        PL_NAME: 'תוכנית 4',
        PL_URL: 'http://url',
        STATION_DESC: 'מאושרות'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              35.217876,
              31.261879
            ],
            [
              35.217877,
              31.261879
            ],
            [
              35.217877,
              31.261880
            ],
            [
              35.217876,
              31.261880
            ],
            [
              35.217876,
              31.261879
            ]
          ]
        ]
      }
    };
    fourthPlan = await planModel.buildFromIPlan(fourthIPlan);

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
});
