const { Knex } = require('../service/database');

exports.getCentroid = (req, res, next) => {
    // blockNum is mandatory to fetch the data (parcelNum optional)
    const { blockNum, parcelNum } = req.query;

    // if blockNum is not passed as a query param
    if (!blockNum) {
        return res.status(422).json({
            status: 'failed',
            msg: 'Please insert at least block number as a query param',
        });
    }

    let sql;

    // if both blockNum and parcelNum are passed as query param then this query will get selected and fetch from parcel_details table
    // blockNum is being matched with gush_num(column name) and parcelNum with parcel(column name)
    if (blockNum && parcelNum) {
        sql = `SELECT id, ST_AsGeoJSON(centroid) as centroid, gush_num, parcel from parcel_details WHERE gush_num=${blockNum} and parcel=${parcelNum}`;
    }
    // if only blockNum is passed then it will fetch from block table
    else if (blockNum) {
        sql = `SELECT id, gush_num, ST_AsGeoJSON(centroid) AS centroid from block where gush_num=${blockNum}`;
    }

    // fetching data
    Knex.raw(sql)
        .then((result) => {
            if (result[0].length === 0) {
                return res.status(404).json({
                    status: 'failed',
                    msg: 'No data found',
                    data: result[0],
                });
            }
            res.status(200).json({ status: 'OK', data: result[0] });
        })
        .catch((err) => {
            req.error = err;
            next();
        });
};

// get the top five result for autosuggestion based on blockNum or parcelNum or both
exports.getTopFive = (req, res, next) => {
    const { blockNum, parcelNum } = req.query;

    // blockNum is mandatory
    if (!blockNum) {
        return res.status(422).json({
            msg: 'Please insert at least block number as a query param',
        });
    }
    let sql;

    // if both blockNum and parcelNum are passed then the following sql query will get selected
    if (blockNum && parcelNum) {
        sql = `SELECT id,gush_num, parcel,ST_AsGeoJSON(centroid) AS centroid from parcel_details where gush_num LIKE '${blockNum}%' and parcel LIKE '${parcelNum}%' limit 5`;
    }
    // if only blockNum is passed then following sql query will get selected
    else if (blockNum) {
        sql = `SELECT id,gush_num, ST_AsGeoJSON(centroid) AS centroid from block WHERE gush_num LIKE '${blockNum}%' limit 5`;
    }

    // fetching data with the selected query(sql)
    Knex.raw(sql)
        .then((result) => {
            if (result[0].length === 0) {
                return res.status(404).json({
                    status: 'failed',
                    msg: 'No data found',
                    data: result[0],
                });
            }
            res.status(200).json({ status: 'OK', data: result[0] });
        })
        .catch((err) => {
            req.error = err;
            next();
        });
};
