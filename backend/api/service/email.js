'use strict';
const Promise = require('bluebird');
const Checkit = require('checkit');
const Nodemailer = require('nodemailer');
const Exception = require('../model/exception');
const Log = require("./log");
const Config = require("./config");
const Mustache = require("mustache");
const Fs = require('fs');
const xml2js = require('xml2js');
const Promath = require('path');
class Email {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  constructor() {
    // create reusable transporter object using the default SMTP transport
    this.config = Config.get("email");
    this.transporter = Nodemailer.createTransport(this.config.options);
    //load templates
    const templateDir = __dirname + "/email/";
    this.templates = {};
    //
    Fs.readdir(templateDir, (err, files) => {
      if (err) {
        Log.error("Email cannot load templates", err);
        return;
      }
      files.forEach((file, index) => {
        Fs.readFile(templateDir + file, 'utf-8', (err, content) => {
          if (err) {
            Log.error("Email cannot load templates", templateDir + file, err);
            return;
          }
          let keys = file.split(".");
          this.templates[keys[0]] = {};
          let title = content.match(/<title[^>]*>((.|[\n\r])*)<\/title>/im);
          this.templates[keys[0]].title = title[1];
          if (!this.templates[keys[0]].title) {
            Log.e(file, "has not title");
          }
          let body = content.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im);
          this.templates[keys[0]].body = body[1];
          if (!this.templates[keys[0]].body) {
            Log.e(file, "has not body");
          }
        });
        Log.info("Loaded email templates");
      });
    });
  }
  init() {
    return new Promise.resolve();
  }
  newSignUp(person) {
    const token = person.getActivationToken();
    let templateProperties = {
      url: Config.get("general.domain") + "/alerts/?activate=" + token
    };
    templateProperties = Object.assign(templateProperties, person.toJSON());
    // setup email data with unicode symbols
    return this.sendWithTemplate(this.templates.newSignUp, templateProperties);
  };

  newPlanAlert(person, plan) {
    let templateProperties = Object.assign(person.toJSON(), plan.toJSON());
    return this.sendWithTemplate(this.templates.alert, templateProperties);
  };

  newAlert(person, alert) {
    let templateProperties = Object.assign(person.toJSON(), plan.toJSON());
    return this.sendWithTemplate(this.templates.newAlert, templateProperties);
  };

  resetPasswordToken(person) {
    let templateProperties = {
      "email":person.get("email"),
      "url": Config.get("general.domain") + "password/reset/?token="+person.resetPasswordToken()
    };
    return this.sendWithTemplate(this.templates.resetPasswordToken, templateProperties);
  };
  newSignUpWithEmail(token) {

    return this.sendWithTemplate(this.templates.newAlert, templateProperties);
  }

  sendWithTemplate(template, templateProperties) {

    return this.send({
      from: '"' + this.config.from_name + '" <' + this.config.from_email + '>', // sender address
      to: templateProperties.email, // list of receivers
      subject: Mustache.render(template.title, templateProperties), // Subject line
      html: Mustache.render(template.body, templateProperties) // html body
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
};
module.exports = new Email();
