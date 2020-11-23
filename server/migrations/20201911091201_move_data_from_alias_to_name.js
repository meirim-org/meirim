exports.up = function(knex) {
	try { 
	const updateQuery = `UPDATE person SET name = alias`
	return knex.raw(updateQuery)
	} catch(err) {
		console.log('err in migration', err)
	}
};

exports.down = function() {};