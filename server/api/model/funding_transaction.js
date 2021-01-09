const Checkit = require('checkit');

const Model = require('./base_model');
const Exception = require('./exception');

class FundingTransaction extends Model {
	get rules () {
		return {
			yaad_id: ['required', 'integer'],
			recurring: ['required', 'boolean'],
			amount: ['required', 'integer']
		};
	}

	get requireFetch () {
		return true;
	}

	get hasTimestamps () {
		return true;
	}

	get tableName () {
		return 'funding_transaction';
	}

	initialize () {
		this.on('saving', this._saving, this);
		super.initialize();
	}

	_saving (model) {
		return new Checkit(model.rules).run(model.attributes);
	}

	canRead () {
		return Promise.resolve(this);
	}

	canEdit (session) {
		throw new Exception.NotAllowed('Cannot edit funding transactions');
	}

	static canCreate (session) {
		return Promise.resolve(this);
	}

	static getCurrentFundingStats () {
		return this.query((qb) => {
			qb.sum('amount as total_amount');
			qb.count('yaad_id as count');
		}).fetchAll();
	}
}

module.exports = FundingTransaction;
