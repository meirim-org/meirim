'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Person = require("../model/person");
const Exception = require("../model/exception");
const Log = require("../service/log");
const Email = require("../service/email");
const _ = require('lodash');
class SignController extends Controller {
  signup(req, res, next) {
    var controller = this;
    return controller.create(req, res, next).then((person) => {
      return Email.newSignUp(person);
    }).then(() => {
      return controller.signin(req, res, next);
    })
  }
  signin(req, res, next) {
    if (!req.body.email) {
      throw new Exception.badRequest("No email provided");
    }
    if (!req.body.password) {
      throw new Exception.badRequest("No password provided");
    }
    const email = req.body.email.toLowerCase().trim();
    Log.debug("Try login with email:", email);
    return Person.forge({email: email}).fetch({require: true}).then(person => {
      if (!person){
        throw new Exception.notAllowed("Password mismatch");
      }

      Log.debug("user was found:", person.get("id"));
      return person;
    }).then(person => {
      return person.checkPassword(req.body.password);
    }).then(person => {
      req.session.person = person;
      Log.debug("user was signedin:", person.get("id"));
      return person;
    });
  }
  signout(req, res, next) {
    if (req.session.destroy()) {
      return true;
    };
    return false;
  }
}
const controller = new SignController(Person);
Router.post('/up', (req, res, next) => {
  controller.wrap(_.bind(controller.signup, controller))(req, res, next);
});
Router.post('/in', (req, res, next) => {
  controller.wrap(_.bind(controller.signin, controller))(req, res, next);
});
Router.post('/out', (req, res, next) => {
  controller.wrap(_.bind(controller.signout, controller))(req, res, next);
});
module.exports = Router;
