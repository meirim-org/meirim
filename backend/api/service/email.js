const Promise = require('bluebird');
const Nodemailer = require('nodemailer');
const Log = require('./log');
const Config = require('./config');
const Mustache = require('mustache');
const Juice = require('juice');
const Fs = Promise.promisifyAll(require('fs'));

class Email {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  constructor() {
    // create reusable transporter object using the default SMTP transport
    this.config = Config.get('email');
    this.transporter = Nodemailer.createTransport(this.config.options);
    // load templates

    this.templates = {};
    //
  }

  init() {
    const templateDir = `${__dirname}/email/`;
    let templates = {},
      wrapper;
    return Fs.readdirAsync(templateDir)
      .then((files) => {
        const promises = [];
        files.forEach((file, index) => {
          promises.push(Fs.readFileAsync(templateDir + file, 'utf-8').then(content => [file, content]));
        });
        return Promise.all(promises);
      }).then((contents) => {
        contents.map((content) => {
          if (!content[1]) {
            Log.error('Email template empty', templateDir + file, err);
            return;
          }
          const key = content[0].split('.')[0];
          if (key == 'wrapper') { wrapper = content[1]; } else { templates[key] = content[1]; }
        });
        return [wrapper, templates];
      }).then((allTemplates) => {
        for (const key in allTemplates[1]) {
          const title = allTemplates[1][key].match(/<title[^>]*>((.|[\n\r])*)<\/title>/im)[1];
          const body = allTemplates[1][key].match(/<body[^>]*>((.|[\n\r])*)<\/body>/im)[1];
          const html = Mustache.render(allTemplates[0], {
            body,
          });
          this.templates[key] = {
            title,
            body: Juice(html),
          };
          Log.info('Loaded template', key);
        }
      })
      .catch((err) => {
        Log.error('Email cannot load templates', err);
      });
  }
  newSignUp(person) {
    const token = person.getActivationToken();
    let templateProperties = {
      url: `${Config.get('general.domain')}/alert.html?activate=${token}`,
    };
    templateProperties = Object.assign(templateProperties, person.toJSON());
    // setup email data with unicode symbols
    return this.sendWithTemplate(this.templates.newSignUp, templateProperties);
  }

  newPlanAlert(person, plan) {
    const templateProperties = Object.assign(person.toJSON(), plan.toJSON());
    return this.sendWithTemplate(this.templates.alert, templateProperties);
  }

  newAlert(person, alert) {
    const templateProperties = Object.assign({}, person, alert.toJSON());
    return this.sendWithTemplate(this.templates.newAlert, templateProperties);
  }

  resetPasswordToken(person) {
    const templateProperties = {
      email: person.get('email'),
      url: `${Config.get('general.domain')}password/reset/?token=${person.resetPasswordToken()}`,
    };
    return this.sendWithTemplate(this.templates.resetPasswordToken, templateProperties);
  }

  sendWithTemplate(template, templateProperties) {
    return this.send({
      from: `"${this.config.from_name}" <${this.config.from_email}>`, // sender address
      to: templateProperties.email, // list of receivers
      subject: Mustache.render(template.title, templateProperties), // Subject line
      html: Mustache.render(template.body, templateProperties), // html body
    });
  }

  send(mailOptions) {
    return new Promise((resolve, reject) => {
      // send mail with defined transport object
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          Log.error(error);
          return reject(error);
        }
        Log.info('Message sent: %s', info.messageId, mailOptions.to);
        return resolve(true);
      });
    });
  }
}
module.exports = new Email();
