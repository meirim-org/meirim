const assert = require('chai').assert

describe('init', function() {
	it('first', function() {
		const { Notification } = require('../../api/model');
		const n = new Notification();
		assert.equal(n.rules.name, 'string')
	});
});