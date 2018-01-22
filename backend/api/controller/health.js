'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Status = require("../model/status");
const _ = require('lodash');
class StatusController extends Controller {}

const controller = new StatusController(Status);
Router.get('/', (req, res, next) => {
  controller.wrap(()=>"")(req, res, next);
});
module.exports = Router;
