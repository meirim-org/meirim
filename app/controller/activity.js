'use strict';
const Router = require('express').Router();
const Activity = require("../model/activity");
const Success = require("../view/success");
const Failure = require("../view/failure");
const ActivityController = {
	browseAction(req, res, next) {
		const activities = Activity.collection().fetch().then(activityCollection => {
			Success.set(res, activityCollection);
		}).catch(function activityCollectionFetched(error) {
			Failure.error(res, error);
		});
	},
	readAction(req, res, next) {},
	saveAction(req, res, next) {}
}
Router.get('/', ActivityController.browseAction);
Router.get('/:activity_id', ActivityController.readAction);
module.exports = Router;
