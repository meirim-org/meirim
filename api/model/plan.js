const Bluebird = require('bluebird');
const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const {	notification_types } = require('../constants');
const { createNotificationsFor } = require('./notification');

// very basic for now
const getPlanUpdateTypes = function(model){
	const updates = [];
	const attrs = model.attributes;
	const prevAttrs = model._previousAttributes;
	if(attrs.status !== prevAttrs.status) {
		updates.push(notification_types['STATUS_CHANGE']);
	}
	return updates;
};

const handleNewPlan = function(model) {
	const planId = model.id;
	const usersInPlanArea = [{ id: 1 }];  // temp mock
	const type = notification_types['NEW_PLAN_IN_AREA']; // temp
	createNotificationsFor({ users: usersInPlanArea, planId, type });
	/// createNotificationsFor({ users: usersInGroups, planId, type: notification_types['USERS_IN_GROUPS'] });
	/// const usersInGroups = ...
};

const handleUpdatedPlan = function(model) {
	const planId = model.id;
	const usersInPlanArea = [{id: 1}]; // temp mock
	const types = getPlanUpdateTypes(model);
	for(let type of types) {
		createNotificationsFor({ users: usersInPlanArea, planId, type });
	}
};

class Plan extends Model {
	get rules() {
		return {
			sent: 'integer',
			OBJECTID: ['required', 'integer'],
			PLAN_COUNTY_NAME: 'string',
			PL_NUMBER: 'string',
			PL_NAME: 'string',
			PLAN_CHARACTOR_NAME: 'string',
			data: ['required'],
			geom: ['required', 'object'],
			jurisdiction: 'string',
			areaChanges: 'string',
			plan_url: 'string',
			status: 'string',
			rating: ['required', 'number']
		};
	}

	defaults() {
		return {
			sent: 0
		};
	}

	// support json encode for data field
	format(attributes) {
		if (attributes.data) {
			attributes.data = JSON.stringify(attributes.data);
		}
		return super.format(attributes);
	}

	// support json encode for data field
	parse(attributes) {
		try {
			if (attributes.data) {
				attributes.data = JSON.parse(attributes.data);
			}
		} catch (e) {
			Log.error('Json parse error', attributes.data);
		}

		return super.parse(attributes);
	}

	get geometry() {
		return ['geom'];
	}

	get hasTimestamps() {
		return true;
	}
	
	get tableName() {
		return 'plan';
	}

	initialize() {
		this.on('created', this._created, this);
		this.on('updated', this._updated, this);
		// super.initialize(); temp as checkit doesnt allow geom to be empty
	}

	_updated(model, attrs, options){
		handleUpdatedPlan(model);
	}
	_created(model, attrs, options) {
		handleNewPlan(model);
	}

	canRead(session) {
		return Bluebird.resolve(this);
	}

	static canCreate(session) {
		if (!session.person || !session.person.admin) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}

	static markPlansAsSent(plan_ids) {
		return new Plan()
			.query(qb => {
				qb.whereIn('id', plan_ids);
			})
			.save(
				{
					sent: '2'
				},
				{
					method: 'update'
				}
			);
	}

	static fetchByObjectID(objectID) {
		return Plan.forge({
			OBJECTID: objectID
		}).fetch();
	}

	static fetchByPlanID(planID) {
		return Plan.forge({
			[Plan.prototype.idAttribute]: planID
		}).fetch();
	}

	static buildFromIPlan(iPlan, oldPlan = null) {
		const data = {
			OBJECTID: iPlan.properties.OBJECTID,
			PLAN_COUNTY_NAME: iPlan.properties.PLAN_COUNTY_NAME || '',
			PL_NUMBER: iPlan.properties.PL_NUMBER || '',
			PL_NAME: iPlan.properties.PL_NAME || '',
			data: iPlan.properties,
			geom: iPlan.geometry,
			PLAN_CHARACTOR_NAME: '',
			plan_url: iPlan.properties.PL_URL,
			status: iPlan.properties.STATION_DESC
		};
		if (oldPlan) {
			oldPlan.set(data);
			return oldPlan.save();
		}

		const plan = new Plan(data);
		return plan.save();
	}

	static setMavatData(plan, mavanData) {
		return plan.set({
			goals_from_mavat: mavanData.goals,
			main_details_from_mavat: mavanData.mainPlanDetails,
			jurisdiction: mavanData.jurisdiction,
			areaChanges: mavanData.areaChanges
		});
	}

	static getUnsentPlans(userOptions) {
		const options = userOptions || {};
		if (!options.limit) {
			options.limit = 1;
		}
		return Plan.query(qb => {
			qb.where('sent', '=', '0');
			if (options.OBJECTID) {
				qb.where('OBJECTID', '=', options.OBJECTID);
			}
		}).fetchPage({
			pageSize: options.limit,
			columns: [
				'id',
				'data',
				'goals_from_mavat',
				'main_details_from_mavat',
				'geom',
				'jurisdiction'
			]
		});
	}
}

module.exports = Plan;


// const getPlanArea = function(plan) {
// 	return 'plan area';
// };

// const getPlanGroups = function(plan) {
// 	return 'plan groups';
// };

// const getUsersInArea = function({area ={}}){
// 	return 'get users in area';
// };

// const getUsersInGroups = function({area ={}}){
// 	return 'get users in groups';
// };


// const handleNewModel = async function(model) {
// 	// const planArea = getPlanArea(model);
// 	// const planGroups = getPlanGroups(model);
// 	// const usersInPlanArea = getUsersInArea({area: planArea});
// 	// const usersInPlanGroups = getUsersInGroups({groups: planGroups});
// 	const usersInPlanArea = [{id: 1}, {id: 2}]; 
// 	// const usersInPlanGroups = [{id: 1}]; 
// 	await generateNotificationsFor({
// 		users: usersInPlanArea, 
// 		model, 
// 		type:notification_types['NEW_PLAN_IN_AREA'] 
// 	});
// };