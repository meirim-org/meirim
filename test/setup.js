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

const database = {
	 connection: null,
	 initialize: function() {
		const K = Knex({
 			client: Config.get('database.client'),
  		connection: Config.get('database.testconnection'),
  		debug: false
		})
		connection = Bookshelf(K)
	 },
	 truncate: function(tables) {

  return Promise.each(tables, function (table) {
		return connection.knex.schema.hasTable(table).then(function(exists) {
			if(exists){
				console.log(`dropping table ${table}`);
    		return connection.knex.schema.dropTable(table);
			}
		})
  });
	 },
	 seed: function(tables) {

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
	 }
}

function truncate (tables) {
  return Promise.each(tables, function (table) {
		return connection.knex.schema.hasTable(table).then(function(exists) {
			if(exists){
				console.log(`dropping table ${table}`);
    		return connection.knex.schema.dropTable(table);
			}
		})
  });
};

function seed (tables) {
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
		console.log('afterAll')
  },

  beforeEach() {
		console.log('before each')
		return truncate().then(seed);
  },

  afterEach() {
		return truncate()
  },

}
