
const bluebird = require('bluebird');
const { chunk } = require('lodash');
exports.up = function (knex) {
	let parcels = []; 
	try {
		parcels = require('../seeds/static-data/parcel.json');	
	}
	catch(e){
		console.log('No parcel data found, skipping');
	}
	if(parcels.length > 0) {
		return knex.schema
			.createTableIfNotExists('parcel', function (table) {
				table.increments('id').primary();
				table.integer('gush').notNullable();
				table.integer('parcel').notNullable();
				table.specificType('centroid', 'GEOMETRY');
			})
			.then(() => {
				const batches = chunk(parcels, 1000);
				return bluebird.map(batches, (batch)=> {
					return knex('parcel').insert(batch.map(parcel =>({
						...parcel,
						centroid: knex.raw(
							`ST_GeomFromGeoJson('${JSON.stringify(
						 parcel.centroid
							)}')`)
					})));}
				, { concurrency: 1 });
			}
			);
	}
};
  
exports.down = function (knex) {
	return knex.schema.dropTable('parcel');
};