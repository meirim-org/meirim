'use strict';
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const Knex = require("../service/database").Knex;
var config = require('../service/config');
module.exports = session({
	secret: config.get('session.secret'),
	resave: false,
	saveUninitialized: true,
	store: new KnexSessionStore({
		knex: Knex
	})
});
