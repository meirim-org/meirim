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
}

module.exports = new AlertController(Alert);

