const Model = require('./base_model');
const { Knex } = require('../service/database');

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
		return this.where({
			person_id,
			plan_id
		})
			.fetchAll()
			.then((existingSubscription) => {
				// if it exists- updating it
				if (existingSubscription && existingSubscription.length > 0) {
					return Promise.resolve(existingSubscription.models[0]);
				}
				return new PlanPerson({
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

	static getPlansByUserId (person_id) {
		return this.where({ person_id })
			.fetchAll()
			.then(existingSubscription => existingSubscription);
	}

	static async getUsersForPlan(plan_id) {
		const res = await Knex.raw(
			`select id, email as person_id, email from person where id in 
			(select person_id from plan_person where plan_id = ?)`
			, [plan_id]
		);
		return res;
	}

}
module.exports = PlanPerson;
