'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Bcrypt = require('bcrypt');
const Bookshelf = require('../service/database').Bookshelf;

const Base_model = require("./base_model");
const Exception = require('./exception');
class Person extends Base_model {
  get rules() {
    return {
      // firstName: [
      //   'required', 'string'
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
    return ['password', 'admin','status']
  }
  get status() {
    return 0;
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
    model.attributes.status = 1;
    model.attributes.email = model.attributes.email.toLowerCase().trim();
  }
  getActivationToken(){
    const data = this.get('email');
    return Bcrypt.hash(data, 10).then(function(hashedPassword) {
      return new Buffer(hashedPassword).toString('base64');
    })
  }
  hashPassword(model, attrs, options) {
    const passwordLength = 6;
    if (!model.hasChanged("password")) {
      return false;
    }
    const password = model.get("password");
    if (password.lenth <= passwordLength){
      throw new Exception.badRequest("Password must be at least "+passwordLength+" charcters")
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
};
module.exports = Bookshelf.model('Person', Person);
