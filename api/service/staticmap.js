const Log = require('../lib/log');
const Config = require('../lib/config');
const path = require('path');

const StaticMaps = require('staticmaps');

const fetchStaticMap = (lat, lon) => {  
  // create map with marker in center
  const map = new StaticMaps({
    width: Config.get('staticmap').get('width'), 
    height: Config.get('staticmap').get('height')
  });

  const marker = {
    img: path.resolve('public/images/map_marker.png'),
    width: 32,
    height: 32,
    coord: [lon, lat],
  };
  map.addMarker(marker);

  return map.render()
    .then(() => {
      // resolve with base64 string so we don't pass buffers around
      return map.image.image.toString('base64');
    })
    .catch((err) => {
      // fail with no image
      Log.error('Cannot generate static map for email', err);
      return '';
    });
};

module.exports = {
    fetchStaticMap
};
