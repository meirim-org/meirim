const Config = require('../lib/config');

const Knex = require('knex');

const env = process.env.NODE_ENV === 'test' ? 'test.database' : 'database';

const KnexConnection = Knex({
	client: Config.get(`${env}.client`),
	connection: Config.get(`${env}.connection`),
	debug: Config.get('debug.database'),
});

const Bookshelf = require('bookshelf');

let BookshelfConnection = Bookshelf(KnexConnection);

BookshelfConnection.plugin(require('../lib/bookshelf-mysql-gis'));

module.exports = {
	Bookshelf: BookshelfConnection,
	Knex,
};
