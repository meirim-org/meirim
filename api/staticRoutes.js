const Router = require('express').Router();

const Log = require('./lib/log');
const Plan = require('./model/plan');
const config = require('../src/config.json');

const pageLocale = config.opengraph.locale;

// all plan pages should render opengraph tags
Router.get(['/plan/:planId', '/plan/:planId/*'], (req, res, next) => {
	const { planId } = req.params;

	// fetch plan details to populate opengraph tags
	Plan.fetchByPlanID(planId)
		.then(plan => {
			res.render('index', {
				layout: false,
				isPlan: true,
				pageLocale,
				pageImage: `${req.protocol}://${req.get('host')}/favicon.ico`,
				data: plan.attributes
			});
		})
		.catch(error => {
			Log.error('failed to fetch plan details');
			Log.error(error);
			res.status(404).render('index', {
				layout: false,
				isError: true,
				pageLocale,
				pageImage: `${req.protocol}://${req.get('host')}/favicon.ico`
			});
		});
});

// all non-plan pages have static opengraph tag values
Router.get('*', (req, res, next) => {
	res.render('index', {
		layout: false,
		isMain: true,
		pageLocale,
		pageImage: `${req.protocol}://${req.get('host')}/favicon.ico`
	});
});

module.exports = Router;
