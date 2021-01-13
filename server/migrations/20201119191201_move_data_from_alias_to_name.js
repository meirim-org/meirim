exports.up = function(knex) {
	try {
		// for users who set their alias - just copy that into the name column. for users
		// who haven't set up a const name using their slightly-obfuscated id
		return knex.raw(`UPDATE person SET name = alias`)
			.then(() => knex.raw(
				`UPDATE
					person,
					(
						SELECT id, CONCAT('משתמש מהאתר הישן ', LPAD(ROUND(id + pc.c/5.7), 5, '0')) AS n
						FROM person, (SELECT COUNT(*) as c FROM person) AS pc
					) AS person_fake_names
				SET name = person_fake_names.n
				WHERE person.id = person_fake_names.id and person.alias IS NULL`));
	} catch(err) {
		console.log("err in migration", err);
	}
};

exports.down = function(knex) {
	try {
		const updateQuery = `UPDATE person SET alias = name WHERE name NOT LIKE 'משתמש מהאתר הישן %'`;
		return knex.raw(updateQuery);
	} catch(err) {
		console.log("err in migration", err);
	}
};
