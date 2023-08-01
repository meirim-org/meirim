const Checkit = require('checkit');
const Promise = require('bluebird');
const Model = require('./base_model');
const { Knex } = require('../service/database');
const Exception = require('./exception');
const Log = require('../lib/log');

class Objection extends Model {
	get rules () {
		return {
			tree_permit_id: ['required', 'integer'],
			content: [ 'string'],
			url: [ 'string'],
			email_sent: ['boolean'],
			last_objection_date: ['datetime']
		};
	}

	defaults () {
		return {
		};
	}

	get tableName () {
		return 'objection';
	}

	initialize () {
		super.initialize();
	}

	canRead (session) {
		return Promise.resolve(this);
	}

	canEdit (session) {
		return this.canRead(session);
	}

	static canCreate (session) {
		if (!session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return Promise.resolve(this);
	}

	getCollection () {
		return this.collection()
			.fetch();
	}

    static getNewObjections() {
		const sql = `SELECT objection.*, tree_permit.place
    FROM objection 
    INNER JOIN tree_permit ON objection.tree_permit_id = tree_permit.id
    WHERE objection.last_objection_date < now()
    AND objection.email_sent = 0`;
		return Knex.raw(sql);
	}
}

module.exports = Objection;