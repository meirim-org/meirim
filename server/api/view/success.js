module.exports = {
	set: (res, result, session) => {
		let data = false;
		let pagination = {};
		const me = {};
		if (session && session.person) {
			me.id = session.person.id;
			me.alias = session.person.name;
		}
		// format collection with pagination

		if (result && result.pagination) {
			data = result.models;
			({ pagination } = result);
		} else {
			data = result;
		}

		res.set('Content-Type', 'application/json; charset=utf-8');
		res.json({
			status: 'OK',
			data,
			pagination,
			me
		});
	},

	// Public api response
	public: (res, result) => {
		let data = false;
		// format collection with pagination
		if (result && result.pagination) {
			data = result.models;
		} else {
			data = result;
		}

		res.set('Content-Type', 'application/json; charset=utf-8');
		res.json(data);
	}
};
