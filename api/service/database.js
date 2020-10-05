const Config = require('../lib/config');
const Knex = require('knex')({
	client: Config.get('database.client'),
	connection: Config.get('database.connection'),
	debug: Config.get('debug.database'),
});
const Bookshelf = require('bookshelf')(Knex);

Bookshelf.plugin(require('../lib/bookshelf-mysql-gis'));

module.exports = {
	Bookshelf,
	Knex,
};
