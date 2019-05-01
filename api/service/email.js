/**
 * Email service.
 * Compiles emails and pushes to an email web service.
 */
const Promise = require('bluebird');
const Nodemailer = require('nodemailer');
const Mustache = require('mustache');
const dir = require('node-dir');
const path = require('path');

const Juice = require('juice');
const Log = require('../lib/log');
const Config = require('../lib/config');
const Alert = require('../model/alert');

class Email {
  /**
   * Generate test SMTP service account from ethereal.email
   * Only needed if you don't have a real mail account for testing
   */
  constructor() {
    // create reusable transporter object using the default SMTP transport
    this.config = Config.get('email');
    this.baseUrl = Config.get('general.domain');
    this.transporter = Nodemailer.createTransport(this.config.options);
    this.templates = {};
    //
  }

  /**
   * Init the class and load the template files.
   */
  init() {
    const templateDir = `${__dirname}/email/`;
    const templates = {};
    const contents = [];
    let mapper = [];
    return new Promise((resolve, reject) => {
      dir.readFiles(
        templateDir,
        {
          match: /.mustache$/,
        },
        (err, content, next) => {
          if (err) {
            reject(err);
          }

          contents.push(content);
          next();
        },
        (err, files) => {
          if (err) {
            reject(err);
          }

          mapper = files;
          resolve();
        }
      );
    }).then(() => {
      mapper.map((file, index) => {
        const key = file
          .split('/')
          .pop()
          .split('.')
          .shift();
        templates[key] = contents[index];
      });

      for (const key in templates) {
        const title = templates[key].match(
          /<title[^>]*>((.|[\n\r])*)<\/title>/im
        )[1];
        const body = templates[key].match(
          /<body[^>]*>((.|[\n\r])*)<\/body>/im
        )[1];
        const html = Mustache.render(templates.wrapper, {
          body,
        });

        this.templates[key] = {
          title,
          body: Juice(html),
        };
      }
    });
  }

  newSignUp(person) {
    const token = person.getActivationToken();
    const templateProperties = {
      url: `${this.baseUrl}activate/?token=${token}`,
      email: person.get('email'),
    };
    // setup email data with unicode symbols
    return this.sendWithTemplate(this.templates.newSignUp, templateProperties);
  }

  newPlanAlert(user, unsentPlan, planStaticMap) {
    const alert = new Alert({
      id: user.alert_id,
      person_id: user.person_id,
    });
    const data = user;

    Object.assign(data, unsentPlan.attributes);
    if (data.data.DEPOSITING_DATE) {
      const dates = data.data.DEPOSITING_DATE.split('T');
      data.data.DEPOSITING_DATE = dates[0];
    }

    // data.unsubscribeLink = `${this.baseUrl}unsubscribe/?token=${alert.unsubsribeToken()}`;
    data.unsubscribeLink = `${
      this.baseUrl
    }alert/?token=${alert.unsubsribeToken()}`;
    data.link = `${this.baseUrl}plan/${unsentPlan.get('id')}/${unsentPlan.get(
      'PL_NAME'
    )}`;
    data.jurisdiction = unsentPlan.get('jurisdiction');
    data.isLocalAuthority = data.jurisdiction === 'מקומית';

    data.attachments = [
      {
        cid: 'planmap',
        filename: 'plan_map.png',
        content: planStaticMap,
        encoding: 'base64',
      },
    ];

    return this.sendWithTemplate(this.templates.alert, data);
  }

  newAlert(person, alert) {
    const templateProperties = Object.assign({}, person, alert.toJSON());
    return this.sendWithTemplate(this.templates.newAlert, templateProperties);
  }

  resetPasswordToken(person) {
    const templateProperties = {
      email: person.get('email'),
      url: `${Config.get(
        'general.domain'
      )}forgot/?token=${person.resetPasswordToken()}`,
    };
    return this.sendWithTemplate(
      this.templates.resetPasswordToken,
      templateProperties
    );
  }

  sendWithTemplate(template, templateProperties) {
    const attachments = templateProperties.attachments
      ? templateProperties.attachments
      : [];

    attachments.push({
      filename: 'logo_email.png',
      path: path.resolve('api/service/email/logo_email.png'),
      cid: 'logomeirim',
    });
    const subject = Mustache.render(template.title, templateProperties)
      .replace(/\r?\n|\r/g, '')
      .replace(/\s\s+/g, ' ');

    const email = {
      from: `"${this.config.from_name}" <${this.config.from_email}>`, // sender address
      to: templateProperties.email, // list of receivers
      subject, // Subject line
      html: Mustache.render(template.body, templateProperties), // html body
      attachments,
      encoding: 'utf8',
      textEncoding: 'base64',
    };

    return this.send(email);
  }

  /**
   * send mail with defined transport object
   * @param {*} mailOptions
   */
  send(mailOptions) {
    return this.transporter
      .sendMail(mailOptions)
      .then((info) =>
        Log.info('Message sent: %s', info.messageId, mailOptions.to)
      );
  }
}
module.exports = new Email();
