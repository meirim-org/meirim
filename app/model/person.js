'use strict';
var Checkit = require('checkit');
var Promise = require('bluebird');
var Bcrypt = Promise.promisifyAll(require('bcrypt'));
const Bookshelf = require("./bookshelf");
const Person = Bookshelf.Model.extend({
	tableName: 'activity',
	idAttribute: 'activity_id',
	hasTimestamps: true,
	rules: {
		person_id: ['required', 'integer'],
		person_name: ['required', 'string'],
		person_email: ['required', 'string'],
		person_password: ['required', 'string'],
		person_status: ['required', 'boolean']
	},
	initialize: function initialize() {
		this.on('saving', this.validateSave);
	},
	validateSave: function () {
		return Checkit(rules).run(this.attributes);
	},
	login: Promise.method(function (email, password) {
		if (!email || !password) throw new Error('Email and password are both required');
		return new this({
			email: email.toLowerCase().trim()
		}).fetch({
			require: true
		}).tap(function (customer) {
			return Bcrypt.compareAsync(password, customer.get('password')).then(function (res) {
				if (!res) throw new Error('Invalid password');
			});
		});
	})
});
module.exports = Bookshelf.model('Person', Person);
