/*!
 * Bookshelf-PostGIS
 *
 * Copyright 2017 Josh Swan and contributors
 * Released under the MIT license
 * https://github.com/joshswan/bookshelf-postgis/blob/master/LICENSE
 */

const get = require('lodash/get');
const omit = require('lodash/omit');
const set = require('lodash/set');
const wkx = require('wkx');

module.exports = (bookshelf) => {
  const proto = bookshelf.Model.prototype;

  bookshelf.Model = bookshelf.Model.extend({
    geography: null,
    geometry: null,

    format(attributes) {

      var newAttributes;
      // Convert geography attributes to raw ST_MakePoint calls with [lon, lat] as bindings
      if (this.geography) {
        Object.keys(this.geography).forEach((key) => {
          const fields = Array.isArray(this.geography[key])
            ? this.geography[key]
            : ['lon', 'lat'];
          const values = fields.map(field => get(attributes, field)).filter(value => typeof value === 'number');

          newAttributes = omit(attributes, fields);

          if (values.length === 2) {
            newAttributes[key] = bookshelf.knex.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', values);
          }
        });
      }

      // Convert geometry attributes to raw ST_GeomFromGeoJSON and stringify GeoJSON attributes
      if (this.geometry) {
        this.geometry.forEach((attr) => {
          if (attributes[attr]) {
            attributes[attr] = bookshelf.knex.raw('ST_GeomFromGeoJSON(?)', [JSON.stringify(attributes[attr])]);
          }
        });
      }

      // Call parent format method
      return proto.format.call(this, attributes);
    },

    parse(attributes) {
      // if (this.geography) {
      //   Object.keys(this.geography).forEach((key) => {
      //     if (attributes[key]) {
      //       const valInHex = attributes[key];
      //       const fields = Array.isArray(this.geography[key])
      //         ? this.geography[key]
      //         : ['lon', 'lat'];
      //       delete attributes.key;
      //
      //       wkx.Geometry.parse(Buffer.from(valInHex, 'hex')).toGeoJSON().coordinates.forEach((coordinate, index) => {
      //         set(attributes, fields[index], coordinate);
      //       });
      //     }
      //   });
      // }

      // Parse geometry columns to GeoJSON
      if (this.geometry) {
        this.geometry.forEach((attr) => {
          if (attributes[attr]) {
            // try {
            //   attributes[attr] = wkx.Geometry.parse(Buffer.from(attributes[attr], 'hex')).toGeoJSON();
            // }
            // catch (e){
            //   console.log(attributes[attr]);
            // }
            }
          }
        );
      }

      // Call parent parse method
      return proto.parse.call(this, attributes);
    }
  });
};
