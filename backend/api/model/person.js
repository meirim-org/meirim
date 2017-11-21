'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Bcrypt = require('bcrypt');
const Crypt = require('../helpers/crypt');
const Bookshelf = require('../service/database').Bookshelf;
const Log = require('../service/log');

const Base_model = require("./base_model");
const Exception = require('./exception');

const seconds = 1000;
class Person extends Base_model {
  get rules() {
    return {
      // firstName: [
      //   'required', 'string'kshelf
      // ],
      // lastName: [
      //   'required', 'string'
      // ],
      email: [
        'required', 'email'
      ],
      password: [
        'required', 'string'
      ],
      status: [
        'required', 'integer'
      ],
      admin: ['integer']
    }
  }
  get hidden() {
    return ['password', 'admin', 'status']
  }

  get tableName() {
    return 'person';
  }
  initialize() {
    this.on('creating', this.assignValues);
    this.on('saving', this.hashPassword);
    super.initialize();
  }
  assignValues(model, attrs, options) {
    model.attributes.status = 0;
    model.attributes.email = model.attributes.email.toLowerCase().trim();
  }
  getActivationToken() {
    const data = this.get('email');
    const hashedPassword = Crypt.encrypt(data);
    return new Buffer(hashedPassword).toString('base64');
  }

  resetPasswordToken() {
    let now = new Date().getTime();
    let data = this.get('id')+"_"+now;
    let token = Crypt.encrypt(data);
    return new Buffer(token).toString('base64');
  }

  static resetPasswordByToken(token,newPassword) {
    let now = new Date().getTime();
    let details = Crypt.decrypt(new Buffer(token, 'base64').toString('ascii'));
    let parts = details.split("_");
    if (parts.length !== 2){
      throw new Exception.badRequest("Invalid token");
    }
    let whenGenerated = parseInt(parts[1],10);
    if (now<whenGenerated){
      Log.debug("resetPasswordByToken:",whenGenerated, "is in the future");
      throw new Exception.badRequest("Invalid token");
    }
    if (now-7200*seconds > whenGenerated){
      Log.debug("resetPasswordByToken:",whenGenerated, "is ",7200*seconds,"in the past");
      throw new Exception.badRequest("Invalid token: token is valid for 2 hours only. Please generate a new token");
    }
    return Person.forge({
      "id":parts[0]
    }).fetch().then(person=>{
      if (!person){
        Log.debug("resetPasswordByToken:Person",parts[0], "not found");
        throw new Exception.badRequest("Invalid token");
      }
      person.set("password",newPassword);
      return person.save();
    }).then(person=>{
      return true;
    });
  }

  hashPassword(model, attrs, options) {
    const passwordLength = 6;
    if (!model.hasChanged("password")) {
      return false;
    }
    const password = model.get("password");
    if (password.lenth <= passwordLength) {
      throw new Exception.badRequest("Password must be at least " + passwordLength + " charcters")
    }
    // hash password
    return Bcrypt.hash(model.get("password"), 10).then(function(hashedPassword) {
      return model.set("password", hashedPassword);
    })
  }

  upload(files) {
    return this;
  }
  checkPassword(password) {
    var person = this;
    return Bcrypt.compare(password, this.get('password')).then(function(res) {
      if (!res) {
        throw new Exception.notAllowed('Password mismatch');
      }
      return person;
    });
  }
  static canCreate(session) {
    if (session.person) {
      throw new Exception.notAllowed("Must be signed out")
    }
    return Promise.resolve(Person);;
  }

  static activateByToken(token) {
    const data = new Buffer(token, 'base64').toString('ascii');
    const email = Crypt.decrypt(data);
    return Person.forge({email: email}).fetch().then(fetchedPerson => {
      fetchedPerson.set("status", 1);
      return fetchedPerson.save().then(()=>{
        return true;
      });
    });
  }
};
module.exports = Bookshelf.model('Person', Person);
