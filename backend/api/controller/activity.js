'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Activity = require("../model/activity");
const _ = require('lodash');
class ActivityController extends Controller {
	create(req, res, next) {

		return this.model.canCreate(req.session).then(()=>{
			return Bookshelf.transaction(t=> {
					return this.mode.forge(req.body).save(null, {transacting: t}).tap(savedModel=> {
						savedModel.addPerson(req.session);
					});
				});
		});
	}
}


var controller = new ActivityController(Activity);

Router.get('/', (req, res, next) => {
	controller.wrap(_.bind(controller.browse, controller))(req, res, next);
});
Router.post('/', (req, res, next) => {
	controller.wrap(_.bind(controller.create, controller))(req, res, next);
});
Router.get('/:id', (req, res, next) => {
	controller.wrap(_.bind(controller.read, controller))(req, res, next);
});
Router.patch('/:id', (req, res, next) => {
	controller.wrap(_.bind(controller.patch, controller))(req, res, next);
});
Router.post('/:id/upload', (req, res, next) => {
	controller.wrap(_.bind(controller.upload, controller))(req, res, next);
});
module.exports = Router;
