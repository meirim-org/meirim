#!/usr/bin/env node

const yargs = require('yargs/yargs');

const Alert = require('../api/model/alert');
const Person = require('../api/model/person');
const Plan = require('../api/model/plan');
const TreePermit = require('../api/model/tree_permit');
const emailService = require('../api/service/email');
const { fetchStaticMap } = require('../api/service/staticmap');

const argv = yargs(process.argv.slice(2))
	.usage('Usage: $0 <email>')
	.version(false)
	.demandCommand(1)
	.argv;

const email = argv._[0];

emailService.init().then(() => {
	const person = new Person({ id: 1, email });

	// user signed up
	emailService.newSignUp(person);

	// user saved a new plan alert
	emailService.newAlert(person.toJSON(), new Alert({ type: 'plan', address: 'כתובת פיקטיבית', radius: '5' }));

	// user saved a new tree alert
	emailService.newAlert(person.toJSON(), new Alert({ type: 'tree', place: 'מקום פיקטיבי' }));

	fetchStaticMap(32.817153, 35.0005748).then((staticMap) => {
		// a new plan was crawled and it matches a user's plan alert
		emailService.newPlanAlert(
			{ email, alert_id: 1, person_id: 1 },
			new Plan({
				id: 1,
				jurisdiction: 'מקומית',
				goals_from_mavat: 'שינוי קו בניין פיקטיבי',
				main_details_from_mavat: 'שינוי קו בניין בהתאם לפיקציה',
				data: {
					DEPOSITING_DATE: '2021-04-21T12:00:00',
					PLAN_COUNTY_NAME: 'חיפה',
					PL_NUMBER: '000-0000000',
					PL_NAME: 'שם פיקטיבי',
					STATION_DESC: 'בהליך אישור',
					ENTITY_SUBTYPE_DESC: 'תכנית מפורטת',
					PL_LANDUSE_STRING: 'מגורים מסחר ותיירות,שטח ציבורי פתוח'
				}
			}),
			staticMap
		);

		// a new tree permit was crawled and it matches a user's tree alert
		emailService.treeAlert(
			{ email, alert_id: 1, person_id: 1 },
			new TreePermit({
				id: 1,
				action: 'כריתה',
				place: 'חיפה',
				street: 'דרך העצמאות',
				street_number: 1,
				total_trees: 5,
				reason_short: 'בניה',
				reason_detailed: 'בניה פיקטיבית',
				start_date: new Date(2021, 4, 21)
			}),
			staticMap
		);
	});

	// user forgot password
	emailService.resetPasswordToken(person);
});
