const Model = require('./base_model');

class Status extends Model {
	get tableName () {
		return 'status';
	}

	canRead () {
		return true;
	}

	getCollection () {
		return this.collection();
	}
}
module.exports = Status;
