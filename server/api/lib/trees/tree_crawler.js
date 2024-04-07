
const database = require('../../service/database');
const moment = require('moment');
const Config = require('../../lib/config');
const Log = require('../log');
const axios = require('axios');

const GEO_CODING_INTERVAL = Config.get('trees.geoCodingInterval');
const MAX_PERMITS = Config.get('trees.maxPermits');

const { HaifaTreePermit } = require('./haifa_tree_permit');
const { RegionalTreePermit } = require('./regional_tree_permit');
const { KKLTreePermit } = require('./kkl_tree_permit');
const { crawlTreesHTML , JERTreePermit } = require('./jerusalem_tree_permit');
const { crawlRGTreesHTML , RGTreePermit } = require('./ramat_gan_tree_permit');
const { crawlHodHashTreesHTML , hodHashTreePermit } = require('./hod_hasharon_tree_permit');
const { crawlBeerShevaTreesHTML , beerShevaTreePermit } = require('./beer_sheva_tree_permit');
const { crawlYavneTreesHTML , yavneTreePermit } = require('./yavne_tree_permit');

const {
	formatDate,
	unifyPlaceFormat,
	generateGeomFromAddress,
} = require('./utils');
const { REGIONAL_OFFICE, START_DATE, PERMIT_NUMBER, TOTAL_TREES, GUSH, HELKA, GEOM, PLACE, STREET, TREE_PERMIT_TABLE, STREET_NUMBER } = require('../../model/tree_permit_constants');
const MORNING = '08:00';
const { crawlTreeExcelByFile } = require('./tree_crawler_excel');
const { crawlTLVTrees, tlvTreePermit } = require('./tlv_tree_permit');
async function saveNewTreePermits(treePermits, maxPermits) {
	// Tree permits are published for objecctions for a period of 2 weeks. taking a 12 months
	// buffer should be enough for human to remove those lines from the excel sheet.
	//We're reading a the rows as a bulk and match them at compute time for performance.

	if (treePermits.length == 0) return [];
	// all tree permits in a chunk should be from the same regional office
	const regionalOffice = treePermits[0].attributes[REGIONAL_OFFICE];
	// this is the only timestamp format knex correcrtly work with
	const time_ago = moment().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ssZ');
	const existingPermitsCompact = new Set();
	await database.Knex(TREE_PERMIT_TABLE).where('updated_at', '>', time_ago.toString())
		.andWhere(REGIONAL_OFFICE, regionalOffice)
		.then(rows => {
			rows.map(row => {
				const key_as_string = `${row[REGIONAL_OFFICE]}_${row[PERMIT_NUMBER]}_${formatDate(row[START_DATE], MORNING, 'YYYY-MM-DD')}`;
				existingPermitsCompact.add(key_as_string);
			});
		})
		.catch(function (error) { Log.error({ message: error, treePermits, }); });

	const newTreePermits = treePermits.map(tp => {
		if (tp !== undefined) {
		try {
			//if tp is not in the hash map of the existing one - add to the new ones
			const compact_tp = `${tp.attributes[REGIONAL_OFFICE]}_${tp.attributes[PERMIT_NUMBER]}_${formatDate(tp.attributes[START_DATE], MORNING, 'YYYY-MM-DD')}`;
			if (tp.attributes[REGIONAL_OFFICE] == regionalOffice && !existingPermitsCompact.has(compact_tp)) {
				Log.debug(`A new tree license! queued for saving ${compact_tp}`);
				return tp; //original one, not compact
			}
		} catch (err) {
			Log.error(`failed on tree permit ${tp}`, err);
			throw err;
		}
	  }
	}).filter(Boolean); // remove undefined values
	//save only the new ones
	try {
		const numPermits = (newTreePermits.length > maxPermits) ? maxPermits : newTreePermits.length;
		const savedTreePermits = [];
		// Not using map / async on purpose, so node won't run this code snippet in parallel
		for await (const tp of newTreePermits.slice(0, numPermits)) {
			await new Promise(r => setTimeout(r, GEO_CODING_INTERVAL)); // max rate to query nominatim is 1 request per second
			const polygonFromPoint = await generateGeomFromAddress(database.Knex, tp.attributes[PLACE], tp.attributes[STREET], tp.attributes[STREET_NUMBER], tp.attributes[GUSH], tp.attributes[HELKA]);
			tp.attributes[GEOM] = polygonFromPoint;
			Log.info(`Saving new tree permit: ${tp.attributes[REGIONAL_OFFICE]} ${tp.attributes[PERMIT_NUMBER]} with ${tp.attributes[TOTAL_TREES]} trees.`);
			tp.attributes[PLACE] = unifyPlaceFormat(tp.attributes[PLACE]);
			await tp.save();
			savedTreePermits.push(tp);
		}
		return savedTreePermits;
	}
	catch (err) {
		Log.error('failed to ingest a message', err.message || err);
		return [];
	}
}

const chooseCrawl = (crawlType) => {

	const haifa = { 'crawler': crawlTreeExcelByFile, 'permitType': HaifaTreePermit };
	const kkl = { 'crawler': crawlTreeExcelByFile, 'permitType': KKLTreePermit };
	const jerusalem = { 'crawler': crawlTreesHTML , 'permitType': JERTreePermit };
	const ramatGan  = { 'crawler': crawlRGTreesHTML , 'permitType': RGTreePermit};
	const hodHasharon  = { 'crawler': crawlHodHashTreesHTML , 'permitType': hodHashTreePermit};
	const beerSheva  = { 'crawler': crawlBeerShevaTreesHTML , 'permitType': beerShevaTreePermit};
	const yavne  = { 'crawler': crawlYavneTreesHTML , 'permitType': yavneTreePermit};
	const tlv  = { 'crawler': crawlTLVTrees , 'permitType': tlvTreePermit};
	const regional = { 'crawler': crawlTreeExcelByFile, 'permitType': RegionalTreePermit };

	const crawlMap = {
		'yavne': [yavne],
		'beerSheva': [beerSheva],
		'hodHasharon': [hodHasharon],
		'ramatGan': [ramatGan],
		'haifa': [haifa],
		'jerusalem': [jerusalem],
		'kkl': [kkl],
		'regional': [regional],
		'tlv': [tlv],
		'all': [tlv, beerSheva,regional, kkl, hodHasharon, haifa, ramatGan, jerusalem, ] // removed yavne for now, as it's buggy
	};

	return crawlMap[crawlType] || crawlMap['all'];
};

const crawlTrees = async (crawlMethod) => {
	let sumPermits = 0;
	let maxPermits = MAX_PERMITS;
	let failures = 0;
	const crawlMethods = chooseCrawl(crawlMethod);

	for  (const method of crawlMethods) {
		for  (const url of  method.permitType.urls) {
			try {
				if (maxPermits <= 0) {
					break;
				}
				const treePermits = await method.crawler(url, method.permitType);
				const newTreePermits = await saveNewTreePermits(treePermits, maxPermits);
				maxPermits = maxPermits - newTreePermits.length;
				sumPermits = sumPermits + newTreePermits.length;
			}
			catch (err) {
				Log.error(err.message || err);
				failures++;
			}
		}

	}
	Log.info(`Done! Total ${sumPermits} new permits`);

    if (failures === 0) {
		// report to monitor that ended successfuly
		const treeFetchingHeartbeatUrl = Config.get('uptimeRobot.treeFetchingHeartbeatUrl');
		try {
			Log.info('reporting to tree fetching monitor on success '+ treeFetchingHeartbeatUrl);
			const response = await axios.get(treeFetchingHeartbeatUrl);
			Log.info('tree fetching monitor success');
		} catch (error) {
			Log.error('tree fetching monitor error msg: ' + error.response.body);
		}
	}

	return sumPermits;
};


module.exports = {
	crawlTrees
};
