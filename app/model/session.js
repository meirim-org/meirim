'use strict';
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
var config = require('./config');
// SQL setup
const knex = require('knex')({
	client: config.get('database.client'),
	connection: config.get('database.connection'),
	debug: config.get('debug.database')
});
module.exports = session({
	secret: config.get('session.secret'),
	resave: false,
	saveUninitialized: false,
	store: new KnexSessionStore({
		knex: knex
	})
});
