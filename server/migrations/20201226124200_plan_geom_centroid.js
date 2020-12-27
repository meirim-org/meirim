exports.up = async function(knex) {
	await knex.schema.table("plan", table => {
		table.specificType("geom_centroid", "GEOMETRY");
	});

	// populate centroid values
	await knex.raw("UPDATE plan SET geom_centroid = ST_Centroid(geom)");

	// make centroid column not-nullable so we can create an index on it and
	// create the index
	await knex.schema.alterTable("plan", table => {
		table.specificType("geom_centroid", "GEOMETRY").notNullable().alter();
		table.index("geom_centroid", "geom_centroid_idx", "spatial");
	});
};

exports.down = async function(knex) {
	await knex.schema.table("plan", table => {
		table.dropIndex("geom_centroid", "geom_centroid_idx");
		table.dropColumn("geom_centroid");
	});
};
