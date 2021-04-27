const Model = require('./base_model');
const Exception = require('./exception');
const { Bookshelf } = require('../service/database');

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

	static async createNotifications({ users, planId, type }) {
		await Bookshelf.transaction(async (transaction) => {
			for (const user of users) {
				const data = {
					person_id: user.person_id,
					plan_id: planId,
					type
				};

				await new Notification(data).save(null, {transacting: transaction});
			}
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
