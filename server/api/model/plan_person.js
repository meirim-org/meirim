const Model = require('./base_model');

class PlanPerson extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			person_id: ['required', 'integer']
		};
	}

	get tableName () {
		return 'plan_person';
	}

	static subscribe (person_id, plan_id) {
		return this.forge({
			person_id,
			plan_id
		})
			.fetchAll()
			.then((existingSubscription) => {
				// if it exists- updating it
				if (existingSubscription && existingSubscription.length > 0) {
					return Promise.resolve(existingSubscription.models[0]);
				}
				return this.forge({
					person_id,
					plan_id
				}).save();
			});
	}

	static unsubscribe (person_id, plan_id) {
		return this.query('where', 'person_id', '=', person_id)
			.query('where', 'plan_id', '=', plan_id)
			.destroy()
			.then(() => true);
	}
}
module.exports = PlanPerson;
