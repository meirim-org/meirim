const set = (res, status, message) => {
	res.status(status).json({
		status: 'Failure',
		data: message
	});
};

module.exports = {
	error: (res, message) => {
		set(res, 500, message);
	},
	notAllowed: (res, message) => {
		set(res, 403, message);
	},
	badRequest: (res, message) => {
		set(res, 400, message);
	},
	duplicate: (res, message) => {
		set(res, 409, message);
	},
	notFound: (res, message) => {
		set(res, 404, message);
	},
	unauthorized: (res, message) => {
		set(res, 401, message);
	}
};
