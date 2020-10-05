const Promise = require('bluebird');
const Config = require('../api/lib/config');
const Knex = require('knex');
const Bookshelf = require('bookshelf');
// Bookshelf.plugin(require('../lib/bookshelf-mysql-gis'))

const tables = [
	'person',
];

let connection;

const database = {
	 connection: null,

	 initialize: function() {
		if (connection != null){
			 return connection;
		}
		const K = Knex({
 			client: Config.get('database.client'),
  		connection: Config.get('database.testconnection'),
  		debug: false
		});
		connection = Bookshelf(K);
		return connection;
	 },

	 truncate: function(tables) {
		return Promise.each(tables, function (table) {
			return connection.knex.schema.hasTable(table).then(function(exists) {
				if(exists){
					console.log(`dropping table ${table}`);
    		return connection.knex.schema.dropTable(table);
				}
			});
		});
	 },

	 seed: function(tables) {
		return Promise.each(tables, function (table) {
			return connection.knex.schema.hasTable(table).then(async function(exists) {
				if(!exists) {
					console.log(`creating table ${table}`);
					await connection.knex.schema.createTable(table, function(t){
						t.increments();
						t.string('firstName', 255);
					});
					return connection.knex('person').insert({firstName: 'first'});
   		} 
			});
		});
	}
};

exports.mochaHooks = {
	beforeAll() {
		database.initialize();
	},

	afterAll() {
		console.log('afterAll');
	},

	beforeEach() {
		console.log('before each');
		return database.seed(tables);
	},

	afterEach() {
		return database.truncate(tables);
	},

};
