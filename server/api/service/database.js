const Config = require('../lib/config');
const log = require('../lib/log')

const Knex = require('knex');

const env = process.env.NODE_ENV === 'test' ? 'test.database' : 'database'; /// hack, should be fixed

const KnexConnection = Knex({
	client: Config.get(`${env}.client`),
	connection: Config.get(`${env}.connection`),
	pool: Config.get(`${env}.pool`),
	debug: Config.get('debug.database')
});

const Bookshelf = require('bookshelf');

let BookshelfConnection = Bookshelf(KnexConnection);

BookshelfConnection.plugin(require('../lib/bookshelf-mysql-gis'));

async function isHealthy() {
	try {
		await KnexConnection.raw("select 1")
		return true
	} catch(e) {
		log.error({ message: "Knex is uhealthy", error: e, })
		return false;
	}

}
module.exports = {
	Bookshelf: BookshelfConnection,
	Knex: KnexConnection,
	isHealthy,	
};
