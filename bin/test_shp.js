const Promise = require("bluebird");
const shapefile = require("shapefile");
const fs = Promise.promisifyAll(require("fs"));
const reproject = require("reproject");

const EPSG3857 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";


console.log("start");
const dir = "4000917291_shp/";
const promises = fs.readdirAsync(dir).map((file) => {
  if (file.indexOf(".shp") !== file.length - 4) return false;

  const dbf = file.replace(".shp", ".dbf");

  return shapefile.open(dir + file, dir + dbf, { encoding: "windows-1255" })
    .then(source => source.read()
      .then((result) => {
        console.log("=================", file, "=================");
        console.log(result.value);

        if (result.done) {
          return false;
        }
        
        return result.value;
      }))
    .then((geoJson) => {
      const wg84 = reproject.toWgs84(geoJson.geometry, EPSG3857);
      Object.assign(geoJson, { geometry: wg84 });
      return geoJson;
    })
    .catch(error => console.error(error.stack));
});

promises.then(res => console.log(JSON.stringify(res)));
// fs.open()
// shapefile.open('example.shp')
//   .then(source => source.read()
//     .then(function log(result) {
//       if (result.done) return;
//       console.log(result.value);
//       return source.read().then(log);
//     }))
//   .catch(error => console.error(error.stack));
