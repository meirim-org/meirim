const Model = require('./base_model');

class Notification extends Model {
	get rules() {
		return {
			name: 'string',
		};
	}
}

module.exports = Notification;
