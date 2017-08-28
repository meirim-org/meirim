'use strict';
const Exception = require('node-exceptions');
class badRequest extends Exception.LogicalException {}
class duplicate extends Exception.LogicalException {}
class notAllowed extends Exception.LogicalException {}
class notImplemented extends Exception.LogicalException {}
class notFound extends Exception.LogicalException {}
class error extends Exception.LogicalException {}
module.exports = {
	badRequest: badRequest,
	duplicate: duplicate,
	notAllowed: notAllowed,
	notImplemented: notImplemented,
	notFound: notFound,
	error: error
}
