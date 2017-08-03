'use strict';
module.exports = {
	set: function (res, status, message) {
		res.status(status).json({
			status: "Failure",
			data: message
		});
	},
	error: function (res, message) {
		this.set(res, 500, message);
	},
	notAllowed: function (res, message) {
		this.set(res, 403, message);
	},
	badRequest: function (res, message) {
		this.set(res, 400, message);
	},
	duplicate: function (res, message) {
		this.set(res, 409, message);
	},
};
