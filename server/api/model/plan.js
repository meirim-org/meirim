const Bluebird = require('bluebird');
const Model = require('./base_model');
const Log = require('../lib/log');
const Exception = require('./exception');
const { Bookshelf, Knex } = require('../service/database');
const PlanChartFiveRow = require('./plan_chart_five_row');
const PlanChartOneSixRow = require('./plan_chart_one_six_row');
const PlanChartOneSevenRow = require('./plan_chart_one_seven_row');
const PlanChartOneEightRow = require('./plan_chart_one_eight_row');
const PlanChart31WithChangeAreaRow = require('./plan_chart_three_one_with_change_row');
const PlanChart31WithoutChangeAreaRow = require('./plan_chart_three_one_without_change_row');
const PlanChart32Row = require('./plan_chart_three_two');
const PlanChartSevenOneRow = require('./plan_chart_seven_one_row');
const PlanChartFourRow = require('./plan_chart_four_row');
const PlanChartSixRow = require('./plan_chart_six_row');
const {	notification_types } = require('../constants');
const Notification = require('./notification');
const Alert = require('./alert');

class Plan extends Model {
	get rules () {
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
			rating: ['required', 'number'],
			views: ['required', 'number'],
			// numeric indicator of interestingness. It is update like the views field, but also eroded over time
			erosion_views: ['required', 'number'],
			plan_url: 'string',
			status: 'string',
			goals_from_mavat: 'string',
			main_details_from_mavat: 'string',
			explanation: 'string',
			geo_search_filter: 'boolean',
			kind_of_plan: 'string',
			laws: 'string',
			permit: 'string',
			union_and_division: 'string',
		};
	}

	defaults () {
		return {
			sent: 0,
			geo_search_filter: false
		};
	}

	// support json encode for data field
	format (attributes) {
		if (attributes.data) {
			attributes.data = JSON.stringify(attributes.data);
		}
		return super.format(attributes);
	}

	get hasTimestamps() {
		return true;
	}

	// support json encode for data field
	parse (attributes) {
		try {
			if (attributes.data) {
				attributes.data = JSON.parse(attributes.data);
			}
		} catch (e) {
			Log.error('Json parse error', attributes.data);
		}

		return super.parse(attributes);
	}

	get geometry () {
		return ['geom'];
	}

	get tableName () {
		return 'plan';
	}

	initialize() {
		this.on('created', this._created, this);
		this.on('updated', this._updated, this);
		this.on('saving', this._saving, this);
		this.on('creating', this._creating, this);
		this.on('updating', this._updating, this);
		super.initialize();
	}

	_creating (model) {
		return new Promise((resolve) => {
			// set the geometry's centroid using ST_Centroid function
			model.set('geom_centroid', Knex.raw('ST_GeomFromText(\'GEOMETRYCOLLECTION EMPTY\')'));
			resolve();
		});
	}

	_updating (model, attrs) {
		return new Promise((resolve) => {
			// if the geometry is being updated update the centroid as well,
			// otherwise never update the centroid since the value is not
			// parsed and formatted like the geometry value is
			if (attrs.geom !== undefined) {
				model.set('geom_centroid', Knex.raw('ST_GeomFromText(\'GEOMETRYCOLLECTION EMPTY\')'));
			} else {
				model.unset('geom_centroid');
			}

			resolve();
		});
	}

	_saving () {
		// return new Checkit(model.rules).run(model.attributes);
	}

	_updated(model){
		this.handleUpdatedPlan(model);
	}

	_created(model) {
		this.handleNewPlan(model);
	}

	async handleNewPlan (model) {
		const planId = model.id;
		const [ usersSubscribedToPlanArea ] = await Alert.getUsersByGeometry(planId);
		const type = notification_types['NEW_PLAN_IN_AREA']; 
		return Notification.createNotifications({ users: usersSubscribedToPlanArea, planId, type });
	}

	async handleUpdatedPlan (model) {
		const types = this.getPlanUpdateTypes(model);
		if(!types.length) return null;

		const planId = model.id;
		const [ usersSubscribedToPlanArea ] = await Alert.getUsersByGeometry(planId);
		for(let type of types) {
			Notification.createNotifications({ users:usersSubscribedToPlanArea ,  planId, type });
		}
	}

	getPlanUpdateTypes (model){
		const updates = [];
		const attrs = model.attributes;
		const prevAttrs = model._previousAttributes;
		if(attrs.status !== prevAttrs.status) {
			updates.push(notification_types['STATUS_CHANGE']);
		}
		return updates;
	}


	canRead () {
		return Bluebird.resolve(this);
	}

	static canCreate(session) {
		if (!session.person || !session.person.admin) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}

	static markPlansAsSent (plan_ids) {
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

	static fetchByObjectID (objectID) {
		return Plan.forge({
			OBJECTID: objectID
		}).fetch();
	}

	static fetchByPlanID (planID) {
		return Plan.forge({
			[Plan.prototype.idAttribute]: planID
		}).fetch();
	}

	static buildFromIPlan (iPlan, oldPlan = null) {
		const data = {
			OBJECTID: iPlan.properties.OBJECTID,
			PLAN_COUNTY_NAME: iPlan.properties.PLAN_COUNTY_NAME || '',
			PL_NUMBER: iPlan.properties.PL_NUMBER || '',
			PL_NAME: iPlan.properties.PL_NAME || '',
			// 'PLAN_CHARACTOR_NAME': iPlan.properties.PLAN_CHARACTOR_NAME || '',
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

	static async setMavatData (plan, mavatData) {
		const addPlanIdToArray = (chart) => {
			chart.forEach(row => { row.plan_id = plan.id; });
		};

		await Bookshelf.transaction(async (transaction) => {
			await plan.set({
				goals_from_mavat: mavatData.goals,
				main_details_from_mavat: mavatData.mainPlanDetails,
				jurisdiction: mavatData.jurisdiction,
				areaChanges: mavatData.areaChanges,
				explanation: mavatData.planExplanation,
				kind_of_plan: mavatData.kindOfPlan,
				laws: mavatData.laws,
				permit: mavatData.permit,
				union_and_division: mavatData.unionAndDivision
			});

			await plan.save(null, { transacting: transaction });

			// delete existing chart rows since we have no identifiers for the single
			// rows and so scrape them all again each time
			for (let modelClass of [PlanChartOneEightRow, PlanChartFourRow, PlanChartFiveRow, PlanChartSixRow]) {
				const chartRows = await modelClass.query(qb => {
					qb.where('plan_id', plan.id);
				}).fetchAll();
				chartRows.models.forEach(async (chartModel) => {
					await chartModel.destroy({ transacting: transaction });
				});
			}

			if (mavatData.chartOneSix !== undefined) {
				addPlanIdToArray(mavatData.chartOneSix);

				for (let i = 0; i < mavatData.chartOneSix.length; i++) {
					try {
						await new PlanChartOneSixRow(mavatData.chartOneSix[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			if (mavatData.chartOneSeven !== undefined) {
				addPlanIdToArray( mavatData.chartOneSeven);

				for (let i = 0; i < mavatData.chartOneSeven.length; i++) {
					try {
						await new PlanChartOneSevenRow(mavatData.chartOneSeven[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			if (mavatData.chartsOneEight !== undefined) {
				const chart181 = mavatData.chartsOneEight.chart181;
				// add plan_id and origin
				chart181.forEach(row => {
					row.plan_id = plan.id;
					row.origin = '1.8.1';
				});

				const chart182 = mavatData.chartsOneEight.chart182;
				chart182.forEach(row => {
					row.plan_id = plan.id;
					row.origin = '1.8.2';
				});

				const chart183 = mavatData.chartsOneEight.chart183;
				chart183.forEach(row => {
					row.plan_id = plan.id;
					row.origin = '1.8.3';
				});

				const chart184 = mavatData.chartsOneEight.chart184;
				chart184.forEach(row => {
					row.plan_id = plan.id;
					row.origin = '1.8.4';
				});

				const chartsOneEight = chart181.concat(chart182, chart183, chart184);
				for (let i = 0; i < chartsOneEight.length; i++) {
					try {
						await new PlanChartOneEightRow(chartsOneEight[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			if (mavatData.chartsThreeOne !== undefined && mavatData.chartsThreeOne['3_1_with_change'] !== undefined) {
				addPlanIdToArray(mavatData.chartsThreeOne['3_1_with_change']);

				for (let i = 0; i < mavatData.chartsThreeOne['3_1_with_change'].length; i++) {
					try {
						await new PlanChart31WithChangeAreaRow(mavatData.chartsThreeOne['3_1_with_change'][i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			if (mavatData.chartsThreeOne !== undefined && mavatData.chartsThreeOne['3_1_without_change'] !== undefined) {
				addPlanIdToArray(mavatData.chartsThreeOne['3_1_without_change']);

				for (let i = 0; i < mavatData.chartsThreeOne['3_1_without_change'].length; i++) {
					try {
						await new PlanChart31WithoutChangeAreaRow(mavatData.chartsThreeOne['3_1_without_change'][i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			if (mavatData.chartsThreeTwo !== undefined && mavatData.chartsThreeTwo.chart3_2_approved !== undefined) {
				const chart3_2_approved = mavatData.chartsThreeTwo.chart3_2_approved;
				addPlanIdToArray(chart3_2_approved);

				for (let i = 0; i < chart3_2_approved.length; i++) {
					chart3_2_approved[i].is_current_state = true;

					try {
						await new PlanChart32Row(chart3_2_approved[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			if (mavatData.chartsThreeTwo !== undefined && mavatData.chartsThreeTwo.chart3_2_suggested !== undefined) {
				const chart3_2_suggested = mavatData.chartsThreeTwo.chart3_2_suggested;
				addPlanIdToArray(chart3_2_suggested);

				for (let i = 0; i < chart3_2_suggested.length; i++) {
					chart3_2_suggested[i].is_current_state = false;

					try {
						await new PlanChart32Row(chart3_2_suggested[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			const chartFourData = mavatData.chartFour;
			if (chartFourData !== undefined) {
				addPlanIdToArray(chartFourData);

				for (let i = 0; i < chartFourData.length; i++) {
					try {
						await new PlanChartFourRow(chartFourData[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			const chartFiveData = mavatData.chartFive;
			if (chartFiveData !== undefined) {
				addPlanIdToArray(chartFiveData);

				for (let i = 0; i < chartFiveData.length; i++) {
					try {
						await new PlanChartFiveRow(chartFiveData[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			const chartSixData = mavatData.chartSix;
			if (chartSixData !== undefined) {
				addPlanIdToArray(chartSixData);

				for (let i = 0; i < chartSixData.length; i++) {
					try {
						await new PlanChartSixRow(chartSixData[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}

			if (mavatData.chartSevenOne !== undefined) {
				addPlanIdToArray(mavatData.chartSevenOne);

				for (let i = 0; i < mavatData.chartSevenOne.length; i++) {
					try {
						await new PlanChartSevenOneRow(mavatData.chartSevenOne[i]).save(null, { transacting: transaction });
					} catch (e) {
						Log.error(e);
					}
				}
			}
		});

		return plan;
	}

	static getUnsentPlans (userOptions) {
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

	static erodeViews () {
		const query = 'UPDATE plan SET erosion_views = FLOOR(erosion_views/2)';
		return Knex.raw(query);
	}
}
module.exports = Plan;
