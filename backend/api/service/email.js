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
    this.transporter = Nodemailer.createTransport(Config.get("email"));
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
          // parse to json
          xml2js.parseString(content, (err, result) => {
            if (err) {
              Log.error("Email parse template", templateDir + file, err);
            }
            // make a nice key and remove the file extension
            let keys = file.split(".");
            this.templates[keys[0]] = result.html;
          });
        });
        Log.info("Loaded email templates");
      });
    });
  }
  init() {
    return new Promise.resolve();
  }
  newSignUp(person) {
    // setup email data with unicode symbols
    return this.sendWithTemplate(this.templates.newSignUp, person);
  };

  sendWithTemplate(template, model) {
    return this.send({
      from: '"' + this.config.from_name + '" <' + this.config.from_email + '>', // sender address
      to: model.get("email"), // list of receivers
      subject: Mustache.render(template.head[0].title[0], model.toJSON()), // Subject line
      html: Mustache.render(template.body[0], model.toJSON()) // html body
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
        return resolve(info);
      });
    });
  }
};
module.exports = new Email();
