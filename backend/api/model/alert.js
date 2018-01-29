'use strict';
const Checkit = require('checkit');
const Promise = require('bluebird');
const Model = require("./base_model");
const Person = require("./person");
const Bookshelf = require('../service/database').Bookshelf;
const Knex = require('../service/database').Knex;
const Geocoder = require("../service/geocoder").geocoder;
const DegreeToMeter = require("../service/geocoder").degreeToMeter;
const Exception = require('./exception');
const Log = require('../service/log');
class Alert extends Model {
  get rules() {
    return {
      person_id: [
        'required', 'integer'
      ],
      address: [
        'required', 'string'
      ],
      geom: [
        'required', 'object'
      ],
      radius: ['required', 'number']
    }
  }
  defaults() {
    return {
      radius: 5
    }
  }

  get geometry() {
    return ['geom'];
  }

  get tableName() {
    return 'alert';
  }

  initialize() {
    this.on('saving', this._saving, this);
    super.initialize();
  }
  _saving(model, attrs, options) {
    // partial validation
    let partialRules = Object.assign(model.rules,{});
    delete partialRules.geom;
    return new Checkit(partialRules).run(model.attributes).then(()=>{
      return Geocoder.geocode(model.get("address")).then(res => {
        let box = [];
        let km = 1000;
        let radius = model.get("radius") * km;
        box.push(DegreeToMeter(res[0].longitude, res[0].latitude, radius, radius));
        box.push(DegreeToMeter(res[0].longitude, res[0].latitude, -radius, radius));
        box.push(DegreeToMeter(res[0].longitude, res[0].latitude, -radius, -radius));
        box.push(DegreeToMeter(res[0].longitude, res[0].latitude, radius, -radius));
        box.push(box[0]);
  
        model.set("geom", {
          "type": "Polygon",
          "coordinates": [box]
        });
        model.set("address", res[0].formattedAddress);
        return new Checkit(model.rules).run(model.attributes);
      })
    });
   
  }

  canRead(session) {
    if (!session.person) {
      throw new Exception.notAllowed("Must be logged in");
    }
    if (this.get("person_id") !== session.person.id) {
      throw new Exception.notAllowed("You cannot read this alert");
    }
    return Promise.resolve(this);
  }

  canEdit(session) {
    return this.canRead(session);
  }

  static canCreate(session) {
    if (!session.person) {
      throw new Exception.notAllowed("Must be logged in");
    }
    return Promise.resolve(this);
  }

  getCollection() {
    return this.collection().query('where', {
      person_id: this.get("person_id")
    }).fetch();
  }

  static getUsersByGeometry(plan_id) {
    return Person.collection().query((qb) => {
      qb.innerJoin('alert', 'alert.person_id', 'person.id')
        .innerJoin('plan', Knex.raw("ST_Intersects(plan.geom,alert.geom)"))
        .where("plan.id", "=", plan_id)
        .groupBy("person.id")
    }).fetch();
  }
};
module.exports = Bookshelf.model('alert', Alert);