'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Bcrypt = require('bcrypt');
const Bookshelf = require("./bookshelf");
const Exception = require('./exception');
const Person = Bookshelf.Model.extend({
	tableName: 'person',
	idAttribute: 'id',
	hasTimestamps: true,
	rules: {
		firstName: ['required', 'string'],
		lastName: ['required', 'string'],
		email: ['required', 'email'],
		password: ['required', 'string'],
		status: ['required', 'integer'],
		admin: ['integer']
	},
	hidden: ['password', 'admin'],
	initialize: function () {
		this.on('creating', this.assignValues);
		this.on('saving', this.validateSave);
		this.on('saving', this.hashPassword);
	},
	assignValues: function (model, attrs, options) {
		model.attributes.status = 1;
		model.attributes.email = model.attributes.email.toLowerCase().trim();
	},
	validateSave: function (model, attrs, options) {
		return Checkit(this.rules).run(this.attributes);
	},
	hashPassword: function (model, attrs, options) {
		if (!model.hasChanged("password")) {
			return;
		}
		// hash password
		return Bcrypt.hash(model.get("password"), 10).then(function (hashedPassword) {
			return model.set("password", hashedPassword);
		})
	},
	upload: function (files) {
		return this;
	},
	checkPassword: function (password) {
		var person = this;
		return Bcrypt.compare(password, this.get('password')).then(function (res) {
			if (!res) throw new Exception.notAllowed('Password mismatch');
			return person;
		});
	}
}, {
	canCreate: function (session) {
		if (session.person) {
			throw new Exception.notAllowed("Must be signed out")
		}
		return Person;
	}
});
module.exports = Bookshelf.model('Person', Person);
