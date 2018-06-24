/*!
 * Bookshelf-PostGIS
 *
 * Copyright 2017 Josh Swan and contributors
 * Released under the MIT license
 * https://github.com/joshswan/bookshelf-postgis/blob/master/LICENSE
 */


module.exports = (bookshelf) => {
  const proto = bookshelf.Model.prototype;

  bookshelf.Model = bookshelf.Model.extend({
    geometry: null,

    format(attributes) {
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

      // // Parse geometry columns to GeoJSON
      if (this.geometry) {
        this.geometry.forEach((attr) => {

          if (attributes[attr]) {
            const json = [];
            // {"type":"Polygon","coordinates":[[[35.379640212039845,32.69184023205915],[35.37974616678122,32.69187421188067],[35.379855948620225,32.691908682199596],[35.37996573054676,32.69194315422536],[35.380030889229474,32.69196410709842],[35.380139179083606,32.69199892731695],[35.38019060635588,32.69201492912333],[35.380249963598104,32.69203339949194],[35.38016950241604,32.69217773876687],[35.380084670316855,32.69220082953114],[35.37989230903486,32.692253190491286],[35.37975953795245,32.69230470502599],[35.379600173150315,32.69233067689005],[35.37956368975587,32.69202529563515],[35.37956776722088,32.692009874328356],[35.37961478078028,32.69183207645877],[35.379640212039845,32.69184023205915]]]}
            if (attributes[attr][0][0][0]) {

              attributes[attr].map((att, i) => {
                json[i] = [];
                att.map((el, k) => {
                  json[i][k] = [];
                  el.map((elj, j) => {
                    json[i][k][j] = [elj.x, elj.y]
                  });
                });
              });

              attributes[attr] = {
                "type": "MultiPolygon",
                "coordinates": json,
              }
            } else {
              attributes[attr].map((el, i) => {
                json[i] = [];
                el.map((elj, j) => {
                  json[i][j] = [elj.x, elj.y];
                });
              });
              attributes[attr] = {
                "type": "Polygon",
                "coordinates": json,
              }
            }
          }
        });
      }

      // Call parent parse method
      return proto.parse.call(this, attributes);
    }
  });
};