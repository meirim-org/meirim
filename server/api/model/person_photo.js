const Model = require('./base_model');

class PersonPhoto extends Model {
	get rules() {
		return {
			id: ['required', 'integer'],
			url: ['required', 'string'],
			person_id: ['required', 'integer'],
		};
	}

	get tableName() {
		return 'person_photo';
	}
}

module.exports = PersonPhoto;
