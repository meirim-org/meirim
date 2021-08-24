const Model = require('./base_model');

class Tag extends Model {
	get rules () {
		return {
			parent_id: [ 'integer'],
			display_name: ['string'],
			score: ['integer'],
			is_super_tag: ['boolean'],
			is_stand_alone: ['boolean'],
			display_tooltip: ['string']
		}

	}

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
