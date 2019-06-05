const NodeGeocoder = require('node-geocoder');
const Config = require('../lib/config');

const geocoder = NodeGeocoder(Config.get('geocoder'));

const degreeToMeter = (lon, lat, dn, de) => {
  // Earth’s radius, sphere
  const R = 6378137;
  const radian = 180;

  // Coordinate offsets in radians
  const dLat = dn / R;
  const dLon = de / (R * Math.cos((Math.PI * lat) / radian));
  // OffsetPosition, decimal degrees
  const latO = lat + (dLat * radian) / Math.PI;
  const lonO = lon + (dLon * radian) / Math.PI;
  return [lonO, latO];
};

module.exports = {
  geocoder,
  degreeToMeter,
};
