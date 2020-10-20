const Log = require('../lib/log');
const Controller = require('../controller/controller');
const Activity = require('../model/activity');
const { Bookshelf } = require('../service/database');

class ActivityController extends Controller {
	create(req) {
		let activity = null;
		return Bookshelf.transaction(t => super.create(req, t)).tap((savedModel) => {
			activity = savedModel;
			return activity.addPerson(req.session.person.id);
		});
	}

	join(req) {
		return this.model
			.forge({
				id: parseInt(req.params.id, 10),
			})
			.fetch()
			.then(activity => activity.canJoin(req.session))
			.then(activity => activity.addPerson(req.session.person.id))
			.then((activity) => {
				Log.debug(this.tableName, 'created success id:', activity.get('id'));
				return activity;
			});
	}
}

module.exports = new ActivityController(Activity);
