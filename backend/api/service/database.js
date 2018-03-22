'use strict';
const config = require('../service/config');
const knex = require('knex')({
	client: config.get('database.client'),
	connection: config.get('database.connection'),
	debug: config.get('debug.database')
});
const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin(['visibility','pagination']);
Bookshelf.plugin(require('../lib/bookshelf-mysql-gis'));
module.exports = {
	Bookshelf:Bookshelf,
	Knex:knex
}
