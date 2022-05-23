#!/usr/bin/env node

const Log = require('../api/lib/log');
const { generateGeomFromAddress, unifyPlaceFormat } = require('../api/lib/trees/utils');
// run over all rows in db tree table and update the geom according to gush helka, if any.
// print to log all the rows visited.
// gushHelkaToPolygon(gush, helka)
const {
	REGIONAL_OFFICE,  PERMIT_NUMBER, TOTAL_TREES,
	GUSH, HELKA, GEOM, PLACE, STREET,
} = require('../api/model/tree_permit_constants');
const Config = require('../api/lib/config');
const GEO_CODING_INTERVAL = Config.get('trees.geoCodingInterval');
const TreePermit = require('../api/model/tree_permit');
const database = require('../api/service/database');

async function updateTreesGushHelka( treeIds){
	Log.info(`update historical trees for tree ids: ${treeIds} `);
	const trees = await TreePermit.query(qb => {
		qb.whereIn('id', treeIds );
		qb.orderBy('id', 'asc');
	}).fetchAll();
	for await (const tree of trees){
		Log.debug(`tree id: ${tree.get('id')}`);
		Log.debug(`tree gush helka: ${tree.get('gush')}-${tree.get('helka')}`);

		await new Promise(r => setTimeout(r, GEO_CODING_INTERVAL)); // max rate to query nominatim is 1 request per second
		const polygonFromPoint = await generateGeomFromAddress(database.Knex, tree.attributes[PLACE], tree.attributes[STREET], tree.attributes[GUSH], tree.attributes[HELKA]);
		tree.attributes[GEOM] = polygonFromPoint;
		Log.info(`Saving new tree permit: ${tree.attributes[REGIONAL_OFFICE]} ${tree.attributes[PERMIT_NUMBER]} with ${tree.attributes[TOTAL_TREES]} trees.`);
		tree.attributes[PLACE] = unifyPlaceFormat(tree.attributes[PLACE]);
		await tree.save();
	}
}
function range(start, end){
	const arr = [];
	for (let i = start; i< end; i++){
		arr.push(i);
	}
	return arr;
}	
updateTreesGushHelka(range(15574,17208)).finally(()=>process.exit());



