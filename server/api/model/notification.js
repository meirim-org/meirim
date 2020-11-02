const Model = require('./base_model');
const Exception = require('./exception');

class Notification extends Model {
	get rules() {
		return {
			person_id: ['required', 'integer'],
			plan_id: ['required', 'integer'],
			seen: 'boolean',
			type: ['required', 'string']
		};
	}	

	get tableName() {
		return 'notification';
	}

	get hasTimestamps() {
		return true;
	}

	static createNotifications({ users, planId, type }) {
		return users.map(function(user) {
			const data = {
				person_id: user.person_id,
				plan_id: planId,
				type,
			};
			const instance = new Notification(data);
			return instance.save();
		});
	}

	defaults() {
		return {
			seen: false 
		};
	}

	static canCreate(session) {
		if (!session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}
}

module.exports = Notification;
