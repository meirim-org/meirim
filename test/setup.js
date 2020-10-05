const Promise = require('bluebird');
const mockRequire = require('mock-require');
const importFresh = require('import-fresh');

const tables = [
	'person',
];


const database = {
	 connection: null,

	 initialize: function(clientConnection) {
		if (this.connection != null){
			 return this.connection;
		}
		this.connection = clientConnection;

		console.log('DATABASE CONNECTION CONFIG', this.connection.knex.context.client.config);
		return this.connection;
	 },

	 truncate: function(tables) {
		const connection = this.connection;
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
		const connection = this.connection;
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
		process.env.NODE_CONFIG = JSON.stringify({
			database: {
				connection: {
			    'host': 'localhost',
					'user': 'root',
					'password': 'password',
					'database': 'test_meirim',
					'charset': 'utf8'
				}
			}
		});
		const testConfig = importFresh('config');
		mockRequire('config', testConfig);
		const { Bookshelf } = require('../api/service/database');
    
		database.initialize(Bookshelf);
	},

	afterAll() {
		mockRequire.stop('config');
	},

	beforeEach() {
		database.seed(tables);
	},

	afterEach() {
		database.truncate(tables);
	},

};
