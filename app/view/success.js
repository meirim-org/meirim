'use strict';
module.exports = {
	set: function (res, data) {
		res.json({
			status: "OK",
			data: data
		});
	}
};
