'use strict';
const Router = require('express').Router();
const Controller = require('../controller/controller');
const Alert = require('../model/alert');
const Email = require('../service/email');
const Log = require('../service/log');
const Exception = require('../model/exception');
const _ = require('lodash');

class AlertController extends Controller {
  create(req, res, next) {
    return super.create(req, res, next).then(savedAlert => {
      return Email.newAlert(req.session.person, savedAlert).then(res=>{
        return savedAlert;
        });
    });
  }

  browse(req, res, next) {
    if (!req.session.person) throw new Exception.notAllowed("Must be logged in");
    return this.model.query('where', 'person_id', '=', req.session.person.id)
      .fetchAll()
      .then(collection => {
      Log.debug(this.tableName, "browse success user",req.session.person.id);
      return collection;
    });
  }

  unsubscribe(req, res, next) {
    return Alert.byToken(req.query.token).fetch().then(fetchedModel=>{
      if (!fetchedModel) throw new Exception.notFound("Nof found");
      Log.debug(this.tableName, " unsubscribe success id:", fetchedModel.get("id"));
      return fetchedModel.destroy(req.body);
    });
  }
}

const controller = new AlertController(Alert);
Router.get('/', controller.wrap(_.bind(controller.browse, controller)));
Router.get('/:id', controller.wrap(_.bind(controller.read, controller)));
Router.post('/', controller.wrap(_.bind(controller.create, controller)));
Router.delete('/unsubscribe', controller.wrap(_.bind(controller.unsubscribe, controller)));
Router.delete('/:id', controller.wrap(_.bind(controller.delete, controller)));



module.exports = Router;
