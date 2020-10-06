const Config = require('../lib/config');

const Knex = require('knex');

const KnexConnection = Knex({
	client: Config.get('database.client'),
	connection: Config.get('database.connection'),
	debug: Config.get('debug.database'),
});

const Bookshelf = require('bookshelf');

let BookshelfConnection = Bookshelf(KnexConnection);

BookshelfConnection.plugin(require('../lib/bookshelf-mysql-gis'));

module.exports = {
	Bookshelf: BookshelfConnection,
	Knex,
};
