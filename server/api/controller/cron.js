const Bluebird = require('bluebird');
const { map, max, take, omitBy, isNil } = require('lodash');
const moment = require('moment');
const Turf = require('turf');
const Config = require('../lib/config');
const Log = require('../lib/log');
const iplanApi = require('../lib/iplanApi');
const Alert = require('../model/alert');
const Plan = require('../model/plan');
const PlanTag = require('../model/plan_tag');
const Email = require('../service/email');
const DigestEmail = require('../service/template_email');
const MavatAPI = require('../lib/mavat');
const { fetchStaticMap } = require('../service/staticmap');
const { crawlTreesExcel } = require('../lib/trees/tree_crawler_excel');
const TreePermit = require('../model/tree_permit');
const PlanAreaChangesController = require('../controller/plan_area_changes');
const getPlanTagger = require('../lib/tags');
const PlanStatusChange = require('../model/plan_status_change');

const iplan = (limit = -1) =>
	iplanApi
		.getBlueLines()
		.then(iPlans => {
			// limit blue lines found so we output only *limit* plans
			if (limit > -1) {
				iPlans.splice(limit);
			}

			return Bluebird.mapSeries(iPlans, iPlan => fetchIplan(iPlan));
		});

const fix_geodata = () => {
	return iplanApi.getBlueLines().then(iPlans =>
		Bluebird.mapSeries(iPlans, iPlan => {
			return Plan.forge({
				PL_NUMBER: iPlan.properties.PL_NUMBER
			})
				.fetch()
				.then(oldPlan => {
					// check if there was an update
					return Plan.buildFromIPlan(iPlan, oldPlan).then(plan => {
						return plan.save();
					});
				})
				.catch(e => {
					console.log('iplan exception\n' + e.message + '\n' + e.stack);
					return Bluebird.resolve();
				});
		})
	);
};

const complete_mavat_data = () =>
	Plan.query(qb => {
		// qb.where("main_details_from_mavat", "=", "");
		qb.whereNull('areaChanges');
		qb.orderBy('id', 'desc');
	})
		.fetchAll()
		.then(planCollection =>
			Bluebird.mapSeries(planCollection.models, plan => {
				Log.debug(plan.get('plan_url'));

				return MavatAPI.getByPlan(plan)
					.then(mavatData => {
						Plan.setMavatData(plan, mavatData);
						Log.debug(
							'Saving with mavat',
							JSON.stringify(mavatData)
						);
						return Promise.all([plan.save(),
							PlanAreaChangesController.refreshPlanAreaChanges(plan.id, plan.attributes.areaChanges)
						]);
					})
					.catch(() => {
						// do nothing on error
					});
			})
		);

const complete_jurisdiction_from_mavat = () =>
	Plan.query(qb => {
		qb.where('jurisdiction', 'IS', null);
	})
		.fetchAll()
		.then(planCollection =>
			Bluebird.mapSeries(planCollection.models, plan => {
				Log.debug(plan.get('plan_url'));
				return MavatAPI.getByPlan(plan).then(async mavatData => {
					await Plan.setMavatData(plan, mavatData);
					await PlanAreaChangesController.refreshPlanAreaChanges(plan.id, plan.attributes.areaChanges);
					Log.debug(
						'saved with jurisdiction from mavat',
						JSON.stringify(mavatData)
					);
				});
			})
		);

const sendPlanningAlerts = () => {
	// send emails for each plan to each user in the geographic area the fits
	// sendPlanningAlerts(req, res, next) {id
	Log.info('Running send planning alert');

	return Plan.getUnsentPlans({
		limit: 1
	})
		.then(unsentPlans => {
			Log.debug('Got', unsentPlans.models.length, 'Plans');
			return unsentPlans.models;
		})
		.mapSeries(unsentPlan => {
			const centroid = Turf.centroid(unsentPlan.get('geom'));
			return Promise.all([
				Alert.getUsersByGeometry(unsentPlan.get('id')),
				fetchStaticMap(
					centroid.geometry.coordinates[1],
					centroid.geometry.coordinates[0]
				)
			]).then(([users, planStaticMap]) => {
				Log.debug(
					'Got',
					users[0].length,
					'users for plan',
					unsentPlan.get('id')
				);

				if (!users[0] || !users[0].length) {
					return {
						plan_id: unsentPlan.get('id'),
						users: 0
					};
				}
				return Bluebird.mapSeries(users[0], user =>
					Email.newPlanAlert(user, unsentPlan, planStaticMap)
				).then(() => ({
					plan_id: unsentPlan.get('id'),
					users: users.length
				}));
			});
		})
		.then(successArray => {
			const idArray = [];
			successArray.reduce((pv, cv) => idArray.push(cv.plan_id), 0);
			if (idArray.length) {
				return Plan.markPlansAsSent(idArray).then(() =>
					Log.info('Processed plans', idArray)
				);
			}
			return true;
		});
};

const planToEmail = async (plan) => {
	if (!plan) return;
	const map = await plan.getMap();
	return {
		id: plan.get('id') || '',
		map,
		title: plan.get('plan_display_name'),
		city: plan.get('PLAN_COUNTY_NAME'),
		text: plan.get('goals_from_mavat'),
		status: plan.get('status'),
		// areaChange: plan.describeHousingChange() || '',
	};
}; 

const alertToEmail = (alert) => {
	const nowDate = moment().format('DD-MM-YY');
	const addressTitle = take((alert.get('address')|| '').split(','), 3).join(', ');
	const alertTitle = `תוכניות חדשות בסביבת ${addressTitle ||  'תחומי הענין שלך'}`;
	const mailSubject = `${alertTitle} | ${nowDate} `;
	return {
		alert: {
			title: alertTitle,
			unsubscribeLink: `${Config.get('general.domain')}alerts/unsubscribe/${alert.unsubsribeToken()}`
		},
		mail: {
			subject: mailSubject
		}
	};
};

const sendDigestPlanningAlerts = async () => {
	// Send emails for each user, by new plans in his area, that
	// have been added since he last received a digest email
	// sendPlanningAlerts(req, res, next) {id
	Log.info('Running digest send planning alert');
	const lastSentDifference = 7; // update
	const maxAlertsToSend = 5;
	const timeDifference = moment.duration(lastSentDifference, 'd');
	const date = moment().subtract(timeDifference);

	try {
		const { alert, email } = await Alert.getAlertToNotify({}, date);
		if(!alert || !email) {
			Log.debug('No alerts to notify');
		}
		const alertGeom = alert.get('geom');
		const alertPlans = await Plan.getPlansByGeometryThatWereUpdatedSince(alertGeom, date);
		console.log(`Got ${alertPlans.length} plans for alert ${alert.get('id')}`);
		Log.debug(`Got ${alertPlans.length} plans for alert ${alert.get('id')}`);

		const emailAlertParams = alertToEmail(alert);
		const plans = { 
			firstPlan: await planToEmail(alertPlans[0]),
			secondPlan: await planToEmail(alertPlans[1]),
			thirdPlan: await planToEmail(alertPlans[2]),
			fourthPlan: await planToEmail(alertPlans[3]),
			fifthPlan: await planToEmail(alertPlans[4]),
		};
		const emailPlanParams = omitBy(plans, isNil);

		try {
			if (alertPlans.length > 0) await DigestEmail.digestPlanAlert(email, emailPlanParams, emailAlertParams);		
			const newUpdateDate = alertPlans.length < maxAlertsToSend ? moment(max(map(alertPlans, 'created_at'))): moment(Date.now());
			alert.set({
				last_email_sent: newUpdateDate.format('YYYY-MM-DD HH:mm:ss')
			});
			await alert.save();	
		
		}
		catch (e) {
			console.log(e);
		}
		Log.debug(`User ${email} alert ${alert.id} with ${alertPlans[0].length} plans`);
	}
	catch(e) {
		Log.debug(`Failed digest plans for alert ${alert.id}`);
	}
	finally {
		process.exit();
	}
};

const sendTreeAlerts = () => {
	// send emails for each tree permit to each user in the place
	Log.info('Running send tree permits alert');

	return TreePermit.getUnsentTreePermits({
		limit: 1
	})
		.then(unsentTrees => {
			Log.debug('Got', unsentTrees.models.length, 'Tree permits');
			return unsentTrees.models;
		})
		.mapSeries(unsentTree => {
			let prepDataPromise;

			if (unsentTree.get('geom')) {
				const centroid = Turf.centroid(unsentTree.get('geom'));

				prepDataPromise = Promise.all([
					Alert.getUsersByPlace(unsentTree.get('id')),
					fetchStaticMap(
						centroid.geometry.coordinates[1],
						centroid.geometry.coordinates[0]
					)
				]);
			} else {
				prepDataPromise = Promise.all([
					Alert.getUsersByPlace(unsentTree.get('id')),
					Promise.resolve()
				]);
			}

			return prepDataPromise.then(([users, treeStaticMap]) => {
				Log.debug(
					'Got',
					users[0].length,
					'users for tree permit',
					unsentTree.get('id')
				);

				if (!users[0] || !users[0].length) {
					return {
						tree_id: unsentTree.get('id'),
						users: 0
					};
				}
				return Bluebird.mapSeries(users[0], user =>
					Email.treeAlert(user, unsentTree, treeStaticMap)
				).then(() => ({
					tree_id: unsentTree.get('id'),
					users: users.length
				}));
			});
		})
		.then(successArray => {
			const idArray = [];
			successArray.reduce((pv, cv) => idArray.push(cv.tree_id), 0);
			if (idArray.length) {
				return TreePermit.markTreesAsSent(idArray).then(() =>
					Log.info('Processed trees', idArray)
				);
			}
			return true;
		});
};

const updatePlanTags = async () => {
	const tagger = await getPlanTagger();
	let start = Number(Date.now());
	Log.info('Re-creating plan tags');
	let tagCounter = 0;
	// Re-compute the tags of a plan if the last update time of the plan is after the last update time of the tags of this plan.
	// Before re-computing the tags of a plan, remove all previous tags for this plan.

	const plans = await Plan.getPlansToTag();
	Log.info(`Processing ${plans.models.length} plans`);
	for (const planOrder in plans.models) {
		const plan = plans.models[planOrder];

		try {
			await PlanTag.deletePlanTags(plan.id);
		}
		catch(e) {
			// if the deletion of existing tags fails, move to the next plan
			Log.info('failed to delete plan tags');
			continue;
		}

		const tags = await tagger(plan);
		// call it even without tags to update the last_tags_update field
		await PlanTag.createPlanTags(plan.id, tags);

		if (tags && tags.length > 0) {
			tagCounter++;
		}

	}
	let end = Number(Date.now());
	const duration = end - start;
	Log.info(`Done. Added tags to ${tagCounter}/${plans.models.length} plans. It took ${duration/1000} seconds`);
};

/** Private */

const fetchIplan = iPlan =>
	Plan.forge({
		PL_NUMBER: iPlan.properties.PL_NUMBER
	})
		.fetch()
		.then(oldPlan => {
			// check if there was an update

			if (
				oldPlan &&
				oldPlan.get('data').LAST_UPDATE === iPlan.properties.LAST_UPDATE
			) {
				return Bluebird.resolve(oldPlan);
			}

			return buildPlan(iPlan, oldPlan)
				// check if there is an update in the status of the plan and mark it for email update
				.then(plan => {
					if (
						!oldPlan ||
						oldPlan.get('data').STATION !==
						iPlan.properties.STATION
					) {
						plan.set('sent', oldPlan ? 1 : 0);
					}
					return plan;
				})
				.then(plan => {
					if (plan !== undefined) {
						plan.save();
					}
				});
		})
		.catch(e => {
			console.log('iplan exception\n' + e.message + '\n' + e.stack);
			return Bluebird.resolve();
		});

const buildPlan = (iPlan, oldPlan) => {
	return Plan.buildFromIPlan(iPlan, oldPlan).then(plan =>
		MavatAPI.getByPlan(plan)
			.then(async mavatData => {
				const retPlan = await Plan.setMavatData(plan, mavatData);
				await PlanAreaChangesController.refreshPlanAreaChanges(plan.id, plan.attributes.areaChanges);
				return retPlan;
			})
			.catch(e => {
				// mavat might crash gracefully
				Log.error('Mavat error', e.message, e.stack);
				return plan;
			})
	);
};

const fetchTreePermit = () =>{
	return crawlTreesExcel();
};

const fetchPlanStatus = () => {

	const planStatusLimit = Config.get('planStatusChange.limit');
	Log.info('plan limit:', planStatusLimit);
	return Plan.query(qb => {
		qb.where('updated_at', '<', moment().subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss'))
			.andWhere('status', '!=', 'התכנית אושרה' );
		qb.limit(planStatusLimit);
	})
		.fetchAll()
		.then(planCollection =>
			Bluebird.mapSeries(planCollection.models, plan => {

				Log.debug(plan.get('plan_url'));

				return MavatAPI.getPlanStatus(plan).then(planStatuses => {
					try {
						const mostRecent = planStatuses.sort((statusA, statusB) => { Date.parse(statusB.attributes.date) - Date.parse(statusA.attributes.date); });
						const mostRecentDate = mostRecent[0].attributes.date;
						const mostRecentStatus = mostRecent[0].attributes.status;
						// update last_status_update in plan table with latest status change date
						plan.save({ 'last_status_update': mostRecentDate, 'status': mostRecentStatus });

						// save all plan statuses into plan_status_change table
						PlanStatusChange.savePlanStatusChange(planStatuses);
					}
					catch (err) {
						Log.error(err);
					}
				});
			}));
};


module.exports = {
	iplan,
	complete_mavat_data,
	sendPlanningAlerts,
	complete_jurisdiction_from_mavat,
	fix_geodata,
	fetchIplan,
	fetchTreePermit,
	sendTreeAlerts,
	sendDigestPlanningAlerts,
	updatePlanTags,
	fetchPlanStatus
};