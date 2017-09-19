'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Person = require("../model/person");
const Alert = require("../model/alert");
const Exception = require("../model/exception");
const Log = require("../service/log");
const Email = require("../service/email");
const _ = require('lodash');
class AlertController extends Controller {
}

const controller = new AlertController(Alert);
Router.get('/', (req, res, next) => {
  controller.wrap(_.bind(controller.browse, controller))(req, res, next);
});
Router.post('/', (req, res, next) => {
  controller.wrap(_.bind(controller.create, controller))(req, res, next);
});
Router.delete('/:alert_id', (req, res, next) => {
  controller.wrap(_.bind(controller.delete, controller))(req, res, next);
});
module.exports = Router;
