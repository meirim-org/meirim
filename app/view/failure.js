'use strict';
module.exports = {
	set: function (res, status, error) {
		res.status(500).json({
			status: "Failure",
			data: error
		});
	},
	error: function (res, error) {
		res.set(res, 500, error);
	},
};
