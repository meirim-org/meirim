'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Person = require("../model/person");
const Exception = require("../model/exception");
const Log = require("../service/log");
const Email = require("../service/email");
const _ = require('lodash');
class PasswordController extends Controller {
  sendResetToken(req, res, next) {
    if (!req.body.email) {
      throw new Exception.badRequest("No email provided");
    }
    const email = req.body.email.toLowerCase().trim();
    Log.debug("Forgot password:", email);
    return Person.forge({email: email}).fetch().then(person=>{
      if (!person){
        throw new Exception.notFound("Email not found");
      }
      return Email.resetPasswordToken(person);
    });
  }
  resetWithToken(req, res, next) {
    if (!req.body.token) {
      throw new Exception.badRequest("No token provided");
    }
    if (!req.body.password) {
      throw new Exception.badRequest("No password provided");
    }

    return Person.resetPasswordByToken(req.body.token,req.body.password);
  }
}
const controller = new PasswordController(Person);
Router.post('/sendResetToken', (req, res, next) => {
  controller.wrap(_.bind(controller.sendResetToken, controller))(req, res, next);
});
Router.post('/resetWithToken', (req, res, next) => {
  controller.wrap(_.bind(controller.resetWithToken, controller))(req, res, next);
});

module.exports = Router;
