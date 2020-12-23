const Model = require('./base_model');
const Log = require('../lib/log');
const { Knex } = require('../service/database');

class CommentPerson extends Model {
	get rules () {
		return {
			comment_id: ['required', 'integer'],
			person_id: ['required', 'integer']
		};
	}

	static async getLikesNumber (commentId) {
		const likes = await Knex.raw('SELECT COUNT(*) as count FROM comment_person WHERE comment_id = ?', [commentId]);
		Log.debug('CommentPerson Controller', 'Get likes for comment', likes[0][0].count);
		return likes[0][0].count; 
	}

	get tableName () {
		return 'comment_person';
	}
}

module.exports = CommentPerson;
