'use strict';
const Bookshelf = require("./bookshelf");
const Activity = Bookshelf.Model.extend({
	tableName: 'activity',
	idAttribute: 'activity_id',
	hasTimestamps: true,
	rules: {
		activity_id: ['required', 'integer'],
		activity_headline: ['required', 'string'],
		activity_address: ['required', 'string'],
		activity_latlon: ['required', 'string'],
		activity_description: ['required', 'string'],
		activity_address: ['required', 'string'],
		activity_status: ['required', 'boolean']
	},
	initialize: function initialize() {},
});
module.exports = Bookshelf.model('Activity', Activity);
