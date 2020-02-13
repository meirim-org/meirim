const Controller = require('../controller/controller')
const Plan = require('../model/plan')
const Exception = require('../model/exception');
const Config = require('../lib/config')
const { Knex } = require('../service/database')
const Exception = require('../model/exception')
const wkt = require('terraformer-wkt-parser')
const GJV = require('geojson-validation')

class PlanController extends Controller {
  browse (req) {
    const columns = [
      'id',
      'PLAN_COUNTY_NAME',
      'PL_NUMBER',
      'PL_NAME',
      'PLAN_CHARACTOR_NAME',
      'goals_from_mavat',
      'main_details_from_mavat',
      'geom'
    ]

    const { query } = req
    const where = {}

    if (query.status) {
      where.status = query.status.split(',')
    }

    if (query.PLAN_COUNTY_NAME) {
      where.PLAN_COUNTY_NAME = query.PLAN_COUNTY_NAME.split(',')
    }
    const order = '-id'

    return super.browse(req, {
      columns,
      where,
      order
    })
  }

  publicBrowse (req) {
    const columns = [
      'id',
      'PLAN_COUNTY_NAME',
      'PL_NUMBER',
      'PL_NAME',
      'PLAN_CHARACTOR_NAME',
      'geom'
    ]

    const { query } = req
    const response = {
      type: 'FeatureCollection',
      bbox: [],
      features: []
    }

    if (!query.polygon) {
      throw new Exception.BadRequest('Missing polygon param')
    }

    const points = req.query.polygon.split(';').map((i) => i.split(',').map((i) => parseFloat(i)))
    const geojson = {
      type: 'Polygon',
      coordinates: [points]
    }
    if (!GJV.valid(geojson)) {
      throw new Exception.BadRequest('polygon is invalid')
    }
    const polygon = wkt.convert(geojson)
    const whereRaw = [
      Knex.raw(`ST_Intersects(geom, ST_GeomFromText("${polygon}",4326))`)
    ]
    const order = '-id'

    return super
      .browse(req, {
        columns,
        whereRaw,
        order,
        pageSize: 1000
      })
      .then(rows => {
        response.features = rows.map(row => ({
          type: "Feature",
          properties: {
              uri: `${Config.general.domain}plan/${row.get("id")}/`,
              name: row.get("PL_NAME"),
              county: row.get("PLAN_COUNTY_NAME"),
              number: row.get("PL_NUMBER")
          },
          geometry: row.get("geom")
      }))
      return response;
    }) 
  }

  browseAdmin(req) {
    if (!req.session.person) {
      throw new Exception.NotAllowed('Must be logged in');
    } else if (!req.session.person.admin) {
      throw new Exception.NotAllowed('Must be an admin');
    }

    const columns = [
      "id",
      "PLAN_COUNTY_NAME",
      "PL_NUMBER",
      "PL_NAME",
      "data"
    ];

    const { query } = req;
    const where = {};

    if (query.status) {
      where.status = query.status.split(",");
    }

    if (query.PLAN_COUNTY_NAME) {
      where.PLAN_COUNTY_NAME = query.PLAN_COUNTY_NAME.split(",");
    }

    const order = query.order || '-id';

    return super.browse(req, {
      columns,
      where,
      order
    });
  }

  county () {
    return Knex.raw(
      'SELECT PLAN_COUNTY_NAME, COUNT(*) as num FROM plan GROUP BY PLAN_COUNTY_NAME'
    ).then(results => results[0])
  }

  statuses () {
    return Knex.raw(
      'SELECT status, COUNT(*) as num  FROM plan GROUP BY status'
    ).then(results => results[0])
  }
}

module.exports = new PlanController(Plan)
