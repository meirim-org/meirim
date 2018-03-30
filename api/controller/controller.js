const Success = require('../view/success');
const Checkit = require('checkit');
const Promise = require('bluebird');
const Log = require('../lib/log');
const Exception = require('../model/exception');
const {
  bind,
} = require('lodash');

class Controller {
  constructor(model) {
    if (model) {
      this.model = model;
      this.id_attribute = model.prototype.idAttribute;
      this.tableName = model.prototype.tableName;
    }
  }
  // try catch wrapper for all controllers
  static wrap(fn, ctx) {
    return (req, res, next) => Promise
      .try(() => (ctx ? bind(fn, ctx)(req) : fn(req)))
      .then(response => Success.set(res, response))
      .catch(Checkit.Error, (err) => {
        req.error = Exception.BadRequest(err);
        next();
      })
      .catch((err) => {
        req.error = err;
        next();
      });
  }
  browse() {
    return this.model
      .fetchAll()
      .then((collection) => {
        Log.debug(this.tableName, 'browse success');
        return collection;
      });
  }
  read(req) {
    const id = parseInt(req.params.id, 10);
    return this.model
      .forge({
        [this.id_attribute]: id,
      })
      .fetch().then((fetchedModel) => {
        if (!fetchedModel) throw new Exception.NotFound('Nof found');
        return fetchedModel.canRead(req.session);
      })
      .then((fetchedModel) => {
        Log.debug(this.tableName, 'read success', fetchedModel.get('id'));
        return fetchedModel;
      });
  }
  patch(req) {
    const id = parseInt(req.params.id, 10);
    return this.model
      .forge({
        [this.id_attribute]: id,
      })
      .fetch()
      .then((fetchedModel) => {
        if (!fetchedModel) throw new Exception.NotFound('Nof found');
        return fetchedModel.canEdit(req.session);
      })
      .then((fetchedModel) => {
        Log.debug(this.tableName, ' patch success id:', fetchedModel.get('id'));
        return fetchedModel.save(req.body);
      });
  }
  delete(req) {
    const id = parseInt(req.params.id, 10);
    return this.model
      .forge({
        [this.id_attribute]: id,
      })
      .fetch()
      .then((fetchedModel) => {
        if (!fetchedModel) throw new Exception.NotFound('Nof found');
        return fetchedModel.canEdit(req.session);
      })
      .then((fetchedModel) => {
        Log.debug(this.tableName, ' delete success id:', fetchedModel.get('id'));
        return fetchedModel.destroy(req.body);
      });
  }
  create(req, transaction) {
    let options = {};
    if (transaction) {
      options = {
        transacting: transaction,
      };
    }
    return this.model
      .canCreate(req.session)
      .then(() => {
        const model = this.model.forge(req.body);
        model.setPerson(req.session);
        return model.save(null, options);
      })
      .then((savedModel) => {
        Log.debug(this.tableName, ' create success id:', savedModel.get('id'));
        return savedModel;
      });
  }
  upload(req) {
    const id = parseInt(req.params[this.id_attribute], 10);
    const model = this.model
      .forge({
        [this.id_attribute]: id,
      });
    return model.canEdit(req.session)
      .then(() => model.upload(req.files));
  }
}
module.exports = Controller;
