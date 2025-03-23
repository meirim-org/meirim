const Exception = require('node-exceptions');

class BadRequest extends Exception.LogicalException {}
class Duplicate extends Exception.LogicalException {}
class NotAllowed extends Exception.LogicalException {}
class NotImplemented extends Exception.LogicalException {}
class NotFound extends Exception.LogicalException {}
class Unauthorized extends Exception.LogicalException {}
class Error extends Exception.LogicalException {}

module.exports = {
	BadRequest,
	Duplicate,
	NotAllowed,
	NotImplemented,
	NotFound,
	Unauthorized,
	Error
};
