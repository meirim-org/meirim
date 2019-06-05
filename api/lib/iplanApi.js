const Request = require("request-promise");
const GeoJSON = require("esri-to-geojson");
const Bluebird = require("bluebird");
const _ = require("lodash");
const reproject = require("reproject");
const Config = require("../lib/config");
const Log = require("../lib/log");

const BASE_AGS_URL =
    "https://ags.iplan.gov.il/arcgis/rest/services/" +
    "PlanningPublic/Xplan2/MapServer";

const options = {
    rejectUnauthorized: false,
    headers: {
        "User-Agent": Config.get("general.userAgent")
    },
    json: true
};

const fields = [
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
    "DEPOSITING_DATE",
    // 'DATE_SAF',
    // 'PL_LAST_DEPOSIT_DATE',
    // 'PL_REJECTION_DATE',
    // 'PLAN_CHARACTOR_NAME',
    // 'מטרות',
    // 'PQ_AUTHORISED_QUANTITY_110',
    // 'PQ_AUTHORISED_QUANTITY_120',
    "PL_DATE_8",
    "PL_LANDUSE_STRING",
    "STATION",
    "STATION_DESC",
    "PL_BY_AUTH_OF",
    "PL_URL",
    "Shape_Area",
    "QUANTITY_DELTA_120",
    "QUANTITY_DELTA_125",
    "LAST_UPDATE",
    "PL_ORDER_PRINT_VERSION",
    "PL_TASRIT_PRN_VERSION"
];

const EPSG3857 =
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";

const getBlueLines = () => {
    const url = `${BASE_AGS_URL}/0/query?f=json&outFields=${fields.join(
        ","
    )}&returnGeometry=true&where=OBJECTID>0&orderByFields=LAST_UPDATE DESC`;
    const requestOptions = _.clone(options);
    Log.debug(url);
    requestOptions.uri = url;
    return Request(requestOptions).then(data => {
        const geojson = GeoJSON.fromEsri(data, {});
        Log.debug("Got", geojson.features.length, "plans");
        return Bluebird.reduce(
            geojson.features,
            (coll, datum) => {
                // overriding geomerty with WGS84 coordinates
                const res = Object.assign({}, datum, {
                    geometry: reproject.toWgs84(datum.geometry, EPSG3857)
                });
                return coll.concat(res);
            },
            []
        );
    });
};

const getPlanningCouncils = () => {
    const url = `${BASE_AGS_URL}/2/query?f=json&outFields=CodeMT,MT_Heb&returnGeometry=false&where=OBJECTID%3E0`;
    Log.debug("Fetch", url);
    const requestOptions = _.clone(options);
    requestOptions.uri = url;
    return Request(requestOptions);
};

module.exports = {
    getBlueLines,
    getPlanningCouncils
};
