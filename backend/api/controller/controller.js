'use strict';
const Success = require("../view/success");
const Failure = require("../view/failure");
const Checkit = require('checkit');
const Promise = require('bluebird');
const Log = require('../service/log');
const Exception = require('../model/exception');
class Controller {
	constructor(model) {
		this.model = model;
		this.id_attribute = model.prototype.idAttribute;
		this.tableName = model.prototype.tableName;
	}
	// try catch wrapper for all controllers
	wrap(fn) {
		return (req, res, next) => {
			// try {
			// must be a Promise
			Promise.try(() => {
				return fn(req, res, next);
			}).then(response => {
				Success.set(res, response);
				// catch validation errors
			}).catch(Checkit.Error, err => {
				Log.debug(err.message);
				return Failure.notAllowed(res, err);
				// catch other errors
			}).catch(err => {
				if (!err) {
					var err = new Error('Page Not Found');
					err.name = "notFound";
					err.status = 404;
				}
				if (err.code == "ER_DUP_ENTRY") {
					// this is specific for MYSQL
					var msg = err.message;
					var index = msg.indexOf("ER_DUP_ENTRY:") + 14;
					Log.debug(err.message);
					return Failure.duplicate(res, msg.substr(index));
				}
				switch (err.name) {
				case 'notAllowed':
					Log.debug("Not allowed", err.message);
					return Failure.notAllowed(res, err.message);
				case 'badRequest':
					Log.debug(err.message);
					return Failure.badRequest(res, err.message);
					// do something
				case 'notFound':
					Log.error(err);
					return Failure.notFound(res, err.message);
				case 'notImplemented':
					Log.debug(err.message);
					return Failure.notImplemented(res, err.message);
					// do something else
				}
				Log.error(err);
				return Failure.error(res, err.message);
			});
		}
	}
	browse(req, res, next) {
		return this.model.collection().fetch().then(collection => {
			Log.debug(this.tableName, " browse success");
			return collection;
		});
	}
	read(req, res, next) {
		const id = parseInt(req.params.id);
		return this.model.forge({
			[this.id_attribute]: id
		}).canRead(req.session).fetch().then(fetchedModel => {
			Log.debug(this.tableName, " read success");
			return fetchedModel;
		});
	}
	patch(req, res, next) {
		const id = parseInt(req.params.id);
		return this.model.forge({
			[this.id_attribute]: id
		}).canEdit(req.session).fetch().then(fetchedModel => {
			return fetchedModel.save(req.body);
		}).then(savedmodel => {
			Log.debug(this.tableName, " patch success id:", savedmodel.get("id"));
			return savedmodel;
		});
	}
	create(req, res, next) {
		return this.model.canCreate(req.session).then(()=>{
			return this.model.forge(req.body).save();
		}).then(savedModel => {
			Log.debug(this.tableName, " create success id:", savedModel.get("id"));
			return savedModel;
		});
	}
	upload(req, res, next) {
		const id = parseInt(req.params[this.id_attribute]);
		return this.model.forge({
			[this.id_attribute]: id
		}).canEdit(req.session).upload(req.files);
	};
}
module.exports = Controller;
