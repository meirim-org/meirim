/* eslint-disable no-undef */
const Promise = require('bluebird')
const Config = require('../api/lib/config')
const Knex = require('knex')
const Bookshelf = require('bookshelf')
// Bookshelf.plugin(require('../lib/bookshelf-mysql-gis'))

const tables = [
  'person',
];

let connection;
function truncate () {
  return Promise.each(tables, function (table) {
		return connection.knex.schema.hasTable(table).then(function(exists) {
			if(exists){
				console.log(`dropping table ${table}`);
    		return connection.knex.schema.dropTable(table);
			}
		})
  });
};

function seed () {
  return Promise.each(tables, function (table) {
		return connection.knex.schema.hasTable(table).then(async function(exists) {
			if(!exists) {
					console.log(`creating table ${table}`);
					await connection.knex.schema.createTable(table, function(t){
					t.increments()
					t.string('firstName', 255)
				})
				return connection.knex('person').insert({firstName: 'first'});
   		} 
		})
  });
};

exports.mochaHooks = {
  beforeAll() {
		const K = Knex({
 			client: Config.get('database.client'),
  		connection: Config.get('database.testconnection'),
  		debug: false
		})
		connection = Bookshelf(K)
	},

  afterAll() {
		// close DB server
		console.log('afterAll')
  },

  beforeEach() {
		// Remove current DB connection if exist
		// Create new connection to DB
		console.log('before each')
		return truncate().then(seed);
  },

  afterEach() {
		// Remove current DB connection
		console.log('after each')

		return truncate()
  },

}
