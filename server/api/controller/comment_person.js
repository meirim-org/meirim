const { Knex } = require('../service/database');
const Controller = require('../controller/controller');
const CommentPerson = require('../model/comment_person');
const Exception = require('../model/exception');

class CommentPersonController extends Controller {
	async addLike (req) {
		if(!req.session.person) {
			throw new Exception.BadRequest('Must be logged in');
		}
		const { commentId } = req.body;
		const { id: personId } = req.session.person;
		const res = await Knex.raw(
			'SELECT * FROM comment_person WHERE(person_id = ?) AND (comment_id = ?)'
			, [personId, commentId]
		);
		if(res[0].length) {
			await Knex.raw(
				'DELETE FROM comment_person WHERE(person_id = ?) AND (comment_id = ?)'
				, [personId, commentId]
			);
			return; 
		}
		else {
			const newRow = new CommentPerson({ comment_id: commentId, person_id: personId });

			return newRow.save();
		}
	}

}

module.exports = new CommentPersonController(CommentPerson);
