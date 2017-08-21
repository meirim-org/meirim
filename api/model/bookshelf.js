'use strict';
const config = require('./config');
const knex = require('knex')({
	client: config.get('database.client'),
	connection: config.get('database.connection'),
	debug: config.get('debug.database')
});
const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin(['registry', 'visibility']);
module.exports = Bookshelf;
