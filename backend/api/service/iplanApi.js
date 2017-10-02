'use strict';
const Request = require("request-promise");
const Knex = require("../service/database").Knex;
const GeoJSON = require('esri-to-geojson');
const Log = require("./log");
const Promise = require("bluebird");
const Plan = require("../model/plan");
const Config = require("./config");
const reproject = require("reproject");
class iplanApi {
  constructor() {
    this.options = {
      qs: {
        // access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
      },
      headers: {
        'User-Agent': Config.get("general.userAgent")
      },
      json: true // Automatically parses the JSON string in the response
    };
    this.EPSG3857 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
  }
  getBlueLines(where) {
    let fields = [
      "OBJECTID",
      "Shape",
      "PLAN_AREA_CODE",
      "JURSTICTION_CODE",
      "PLAN_COUNTY_NAME",
      "PLAN_COUNTY_CODE",
      "ENTITY_SUBTYPE_DESC",
      "PL_NUMBER",
      "PL_NAME",
      "PL_AREA_DUNAM",
      "DATE_SAF",
      "DEPOSITING_DATE",
      "PL_LAST_DEPOSIT_DATE",
      "PL_REJECTION_DATE",
      "PL_DATE_8",
      "PLAN_CHARACTOR_NAME",
      "מטרות",
      "PL_LANDUSE_STRING",
      "STATION",
      "STATION_DESC",
      "PL_BY_AUTH_OF",
      "PL_URL",
      "Shape_Area",
      "QUANTITY_DELTA_120",
      "QUANTITY_DELTA_125",
      "PQ_AUTHORISED_QUANTITY_110",
      "PQ_AUTHORISED_QUANTITY_120",
      "LAST_UPDATE",
      "PL_ORDER_PRINT_VERSION",
      "PL_TASRIT_PRN_VERSION"
    ];

    let url = "https://ags.moin.gov.il/arcgis/rest/services/mehoziot_app/MapServer/0/query";
    url += "?f=json&outFields=" + fields.join(",") + "&returnGeometry=true";
    url += "&where=" + where;

    Log.debug("Fetch", url);
    this.options.uri = url;

    return Request(this.options).then((data) =>{

      let geojson = GeoJSON.fromEsri(data);
      Log.debug("Got", geojson.features.length, "plans");
      Promise.map(geojson.features, datum => {

        let reproejcted =reproject.toWgs84(datum.geometry, this.EPSG3857);
        return Plan.forge({"OBJECTID": datum.properties.OBJECTID}).fetch().then(existingPlan=>{
          if (!existingPlan){
            return Plan.forge({
              "OBJECTID": datum.properties.OBJECTID,
              "PLAN_COUNTY_NAME": datum.properties.PLAN_COUNTY_NAME
                ? datum.properties.PLAN_COUNTY_NAME
                : "",
              "PL_NUMBER": datum.properties.PL_NUMBER
                ? datum.properties.PL_NUMBER
                : "",
              "PL_NAME": datum.properties.PL_NAME
                ? datum.properties.PL_NAME
                : "",
              "PLAN_CHARACTOR_NAME": datum.properties.PLAN_CHARACTOR_NAME?datum.properties.PLAN_CHARACTOR_NAME:"",
              "data": datum.properties,
              "geom": reproejcted
            }).save().then(success=>{
              Log.debug("Saved plan",datum.properties.PL_NUMBER);
            });
          }
          return true;
        })
        .catch((error)=> {
          // Log.error(datum, error)
        });;
      });
    });
  }

  getPlanningCouncils(){
    var url = "https://ags.moin.gov.il/arcgis/rest/services/mehoziot_app/MapServer/2/query?"+
    "f=json&outFields=CodeMT,MT_Heb&returnGeometry=false&where=OBJECTID%3E0";

    Log.debug("Fetch", url);
    this.options.uri = url;

    return Request(this.options);
  }
}
module.exports = new iplanApi();
