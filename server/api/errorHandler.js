const Log = require('./lib/log');
const Exception = require('./model/exception');
const Failure = require('./view/failure');

module.exports = (req, res) => {
	const err = req.error ? req.error : new Exception.NotFound('Not Found');

	if (err.code === 'ER_DUP_ENTRY') {
		// this is specific for MYSQL
		const index = err.message.indexOf('ER_DUP_ENTRY:') + 14;
		return Failure.duplicate(res, err.message.substr(index));
	}

	const url = `${req.ip} - ${req.method}:${req.path} ${JSON.stringify(req.query)}`;

	if (err.name === 'NotAllowed') {
		Log.info('NotAllowed', err.message, url);
		return Failure.notAllowed(res, err.message);
	}
	if (err.name === 'BadRequest') {
		Log.info('BadRequest', err.message, url);
		return Failure.badRequest(res, err.message);
	}
	if (err.name === 'NotFound') {
		Log.info('NotFound', err.message, url);
		return Failure.notFound(res, err.message);
	}
	if (err.name === 'Unauthorized') {
		Log.info('Unauthorized', err.message, url);
		return Failure.unauthorized(res, err.message);
	}
	if (err.name === 'NotImplemented') {
		Log.info('NotImplemented', err.message, url);
		return Failure.notImplemented(res, err.message);
	}
	
	// serious errors
	Log.error({
		message: 'General error',
		error: err,
	});

	// db errors
	if (err.code === 'ER_GIS_INVALID_DATA') {
		return Failure.badRequest(res, 'GIS data is invalid');
	}

	return Failure.error(res, 'General error. Please contact us if you receive this error.');
};
