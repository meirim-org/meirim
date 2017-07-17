'use strict';
const Router = require('express').Router();
const Passport = require("../model/passport");
const Success = require("../view/success");
const Failure = require("../view/failure");
const PassportController = {
		signinAction: function (req, res, next) {
			Passport.authenticate('local', {
					failureRedirect: '/login'
				}),
				function (req, res) {
					res.redirect('/');
				});
	},
	signoutAction: function (req, res, next) {
		req.logout();
		res.redirect('/');
	},
	createAction: function (req, res, next) {},
	createFormAction: function (req, res, next) {}
}
Router.get('/', PassportController.createFormAction);
Router.post('/login', PassportController.signinAction);
module.exports = Router;
