'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Bcrypt = require('bcrypt');
const Bookshelf = require("./bookshelf");
const Exception = require('./exception');
class Person extends Bookshelf.Model{
  get rules() {
    return {
      firstName: [
        'required', 'string'
      ],
      lastName: [
        'required', 'string'
      ],
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
    return ['password', 'admin']
  }

  get tableName() {
    return 'person';
  }

  get hasTimestamps() {
    return true;
  }
  get idAttribute() {
    return 'id';
  }

  get hasTimestamps() {
    return true;
  }
  initialize() {
    this.on('creating', this.assignValues);
    this.on('saving', this.validateSave);
    this.on('saving', this.hashPassword);
  }
  assignValues(model, attrs, options) {
    model.attributes.status = 1;
    model.attributes.email = model.attributes.email.toLowerCase().trim();
  }
  validateSave(model, attrs, options) {
    return Checkit(this.rules).run(this.attributes);
  }
  hashPassword(model, attrs, options) {
    if (!model.hasChanged("password")) {
      return;
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
      if (!res)
        throw new Exception.notAllowed('Password mismatch');
      return person;
    });
  }
	static canCreate(session) {
    if (session.person) {
      throw new Exception.notAllowed("Must be signed out")
    }
    return  Promise.resolve(Person);;
  }
};
module.exports = Bookshelf.model('Person', Person);
