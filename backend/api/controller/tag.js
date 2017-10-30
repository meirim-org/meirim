'use strict';
const Router = require('express').Router();
const Controller = require("../controller/controller");
const Tag = require("../model/tag");
const _ = require('lodash');
class TagController extends Controller {

}

const controller = new TagController(Tag);
Router.get('/', (req, res, next) => {
  controller.wrap(_.bind(controller.browse, controller))(req, res, next);
});
module.exports = Router;
