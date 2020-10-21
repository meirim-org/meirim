const Model = require('./base_model');

class Tag extends Model {
	get tableName () {
		return 'tag';
	}

	canRead () {
		return true;
	}

	getCollection () {
		return this.collection();
	}
}
module.exports = Tag;
