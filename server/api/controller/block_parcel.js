const { Knex } = require('../service/database');
const Controller = require('./controller');
const Exception = require('../model/exception');

class BlockparcelController extends Controller {
	topfive(req) {
		let { blockNum, parcelNum, limit } = req.query;

		blockNum = parseInt(blockNum);
		parcelNum = parseInt(parcelNum);
		limit = parseInt(limit);

		// blockNum is mandatory
		if (!blockNum) {
			throw new Exception.BadRequest('No block number provided, provide it as a query param');
		}

		if (!limit) {
			limit = 5;
		}
		let query;

		// if both blockNum and parcelNum are passed then the following query query will get selected
		if (blockNum && parcelNum) {
			query = `SELECT id,gush, parcel as label ,ST_AsGeoJSON(centroid) AS centroid  from parcel where gush = '${blockNum}' and parcel LIKE '${parcelNum}%' order by parcel limit ${limit}`;
		}
		// if only blockNum is passed then following query query will get selected
		else if (blockNum) {
			query = `SELECT gush as label from block WHERE gush LIKE '${blockNum}%' order by gush limit ${limit}`;
		}

		return Knex.raw(query).then((results) => {
			if (results[0].length == 0) {
				throw new Exception.NotFound({
					status: 'failed',
					msg: 'No data found',
					data: results[0],
				});
			}
			return results[0];
		});
	}

	centroid(req) {
		// blockNum is mandatory to fetch the data (parcelNum optional)
		let { blockNum, parcelNum } = req.query;

		blockNum = parseInt(blockNum);
		parcelNum = parseInt(parcelNum);

		// if blockNum is not passed as a query param
		if (!blockNum) {
			throw new Exception.BadRequest('No block number provided, provide it as a query param');
		}
		let query;

		// if both blockNum and parcelNum are passed as query param then this query will get selected and fetch from parcel_details table
		// blockNum is being matched with gush_num(column name) and parcelNum with parcel(column name)
		if (blockNum && parcelNum) {
			query = `SELECT id, ST_AsGeoJSON(centroid) as centroid, gush, parcel from parcel WHERE gush=${blockNum} and parcel=${parcelNum}`;
		}
		// if only blockNum is passed then it will fetch from block table
		else if (blockNum) {
			query = `SELECT id, gush, ST_AsGeoJSON(centroid) AS centroid from block where gush=${blockNum}`;
		}
		return Knex.raw(query).then((results) => {
			if (results[0].length == 0) {
				throw new Exception.NotFound({
					status: 'failed',
					msg: 'No data found',
					data: results[0],
				});
			}
			return results[0];
		});
	}
}

module.exports = new BlockparcelController();