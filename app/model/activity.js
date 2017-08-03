'use strict';
const Bookshelf = require("./bookshelf");
const Checkit = require('checkit');
const Exception = require('./exception');
const Log = require("./log");
const Sharp = require('sharp');
const Activity = Bookshelf.Model.extend({
	tableName: 'activity',
	idAttribute: 'id',
	hasTimestamps: true,
	rules: {
		id: ['required', 'integer'],
		headline: ['required', 'string'],
		address: ['required', 'string'],
		latlon: ['required', 'string'],
		description: ['required', 'string'],
		status: ['required', 'integer']
	},
	initialize: function () {},
	upload: function (files) {
		var newPath = __dirname + "/public/images/uploads/";
		Log.debug(files);
		if (!files) return new Exception.badRequest('No files were uploaded');
		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
		Log.debug(files);
		Object.keys(files).forEach(function (key) {
			Log.debug("Handeling file:", key);
			let sampleFile = files[key];
			sharp(sampleFile).resize(320, 240).toFile('newPath/output.jpg', (err, info) => {
				if (err) return new Exception.error(err);
				Log.debug("Node handeling file:", key);
				return this;
			});
		});
		// Use the mv() method to place the file somewhere on your server
		// sampleFile.mv('/somewhere/on/your/server/filename.jpg', function (err) {
		// 	if (err) return res.status(500).send(err);
		// 	res.send('File uploaded!');
		// });
		// return this;
	},
	canRead: function (session) {
		return this;
	},
	canPatch: function (session) {
		// if (!session.person || !session.person.admin) {
		// 	throw new Exception.notAllowed("Must be an admin")
		// }
		return this;
	}
}, {
	canCreate: function (session) {
		if (!session.person) {
			throw new Exception.notAllowed("Must be signed in")
		}
		return Activity;
	}
});
// private
module.exports = Bookshelf.model('Activity', Activity);
