'use strict';

const NodeGeocoder = require('node-geocoder');
const Config = require("./config");

const instance = NodeGeocoder({'user-agent': Config.get("general.userAgent"), provider: 'openstreetmap'});
const degreeToMeter = function(lon, lat, dn, de) {

  //Earth’s radius, sphere
  let R = 6378137;
  let radian = 180;

  //Coordinate offsets in radians
  let dLat = dn / R;
  let dLon = de / (R * Math.cos(Math.PI * lat / radian));
  console.log(dLat,dLon);
  //OffsetPosition, decimal degrees
  let latO = lat + dLat * radian / Math.PI;
  let lonO = lon + dLon * radian / Math.PI;
  console.log(latO,lonO);
  return [lonO, latO];
}

module.exports = {
  geocoder: instance,
  degreeToMeter: degreeToMeter
}
