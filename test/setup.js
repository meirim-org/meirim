const mockRequire = require('mock-require');
const importFresh = require('import-fresh');
const { mockDatabase } = require('./mock')

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
    
		mockDatabase.initialize(Bookshelf);
	},

	afterAll() {
		mockRequire.stop('config');
	},

};
