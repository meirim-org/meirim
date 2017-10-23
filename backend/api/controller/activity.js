'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Activity = require("../model/activity");
const Bookshelf = require("../service/database").Bookshelf;
const _ = require('lodash');
const Log = require('../service/log');
class ActivityController extends Controller {

  create(req, res, next) {
    var activity = null;
    return Bookshelf.transaction(t => {
      return super.create(req, res, next,t).tap(savedModel => {
        activity = savedModel;
        return activity.addPerson(req.session.person.id);
      });
    });
  }

  join(req, res, next) {
    const id = parseInt(req.params.id,10);
    return this.model.forge({"id": id}).fetch().then((activity) => {
      return activity.canJoin(req.session);
    }).then((activity) => {
      return activity.addPerson(req.session.person.id);
    }).then((activity) => {
      Log.debug(this.tableName, " created success id:", activity.get("id"));
      return activity;
    });
  }
}

const controller = new ActivityController(Activity);

Router.get('/', (req, res, next) => {
  controller.wrap(_.bind(controller.browse, controller))(req, res, next);
});
Router.post('/', (req, res, next) => {
  controller.wrap(_.bind(controller.create, controller))(req, res, next);
});
Router.get('/:id', (req, res, next) => {
  controller.wrap(_.bind(controller.read, controller))(req, res, next);
});
Router.post('/:id/join', (req, res, next) => {
  controller.wrap(_.bind(controller.join, controller))(req, res, next);
});
Router.post('/:id/upload', controller.model.uploadMiddleWareFactory(), (req, res, next) => {
  controller.wrap(_.bind(controller.upload, controller))(req, res, next);
});
module.exports = Router;
