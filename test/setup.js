exports.mochaHooks = {
	beforeAll() {
		const { Bookshelf } = require('../api/service/database');
		const { mockDatabase } = require('./mock');
		mockDatabase.initialize(Bookshelf);
	},

	afterAll() {
	},

};
