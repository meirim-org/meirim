const Checkit = require('checkit');
const Promise = require('bluebird');
const Model = require('./base_model');
const Person = require('./person');
const Crypt = require('../lib/crypt');
const moment = require('moment');
const { Knex } = require('../service/database');
const Geocoder = require('../service/geocoder').geocoder;
const DegreeToMeter = require('../service/geocoder').degreeToMeter;
const Exception = require('./exception');
const { fetchOrGeocodePlace } = require('../service/osm_geocoder');
const Log = require('../lib/log');

class Alert extends Model {
	get rules () {
		return {
			person_id: ['required', 'integer'],
			address: [ 'string'],
			geom: [ 'object'],
			radius: ['string'],
			place: ['string'],
			type: ['string']
		};
	}

	defaults () {
		return {
			radius: '4',
			type: 'plan'
		};
	}

	get geometry () {
		return ['geom'];
	}

	get radius () {
		return ['radius'];
	}

	get tableName () {
		return 'alert';
	}

	initialize () {
		if(this.get('address')){
			this.on('saving', this.geocodeAddress, this);
		}
		if(this.get('place')){
			this.on('saving', this.geocodePlace, this);
		}
		super.initialize();
	}

	alerts () {
		return this.belongsTo(Person);
	}

	person () {
		return this.belongsTo(Person);
	}

	geocodePlace(model) {		
		return fetchOrGeocodePlace({ db:Knex,'table':'alert','place': this.get('place') })
			.then(geom => {
				const partialRules = Object.assign(model.rules, {});
				delete partialRules.geom;
				return new Checkit(partialRules).run(model.attributes).then(() => {
					model.set('geom', {
						type: 'Polygon',
						coordinates: [[ [ geom.longitude, geom.latitude],[ geom.longitude, geom.latitude],[ geom.longitude, geom.latitude],[ geom.longitude, geom.latitude]  ]]
					});
					return new Checkit(model.rules).run(model.attributes);
				});
			})
			.catch(err => { Log.error(err); });	
	}

	geocodeAddress (model) {
		// partial validation
		const partialRules = Object.assign(model.rules, {});
		delete partialRules.geom;
		return new Checkit(partialRules).run(model.attributes).then(() => {
			return Geocoder.geocode(model.get('address')).then(res => {
				if (!res[0]) {
					throw new Exception.NotFound('The address does not exist');
				}
				const box = [];
				const km = 1000;
				const radius = model.get('radius') * km;
				box.push(
					DegreeToMeter(
						res[0].longitude,
						res[0].latitude,
						radius,
						radius
					)
				);
				box.push(
					DegreeToMeter(
						res[0].longitude,
						res[0].latitude,
						-radius,
						radius
					)
				);
				box.push(
					DegreeToMeter(
						res[0].longitude,
						res[0].latitude,
						-radius,
						-radius
					)
				);
				box.push(
					DegreeToMeter(
						res[0].longitude,
						res[0].latitude,
						radius,
						-radius
					)
				);
				box.push(box[0]);

				model.set('geom', {
					type: 'Polygon',
					coordinates: [box]
				});
				model.set('address', res[0].formattedAddress);
				return new Checkit(model.rules).run(model.attributes);
			});
		});
	}

	canRead (session) {
		if (!session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		if (this.get('person_id') !== session.person.id) {
			throw new Exception.NotAllowed('You cannot read this alert');
		}
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
			.query('where', {
				person_id: this.get('person_id')
			})
			.fetch();
	}

	unsubsribeToken () {
		const token = Crypt.encrypt(
			`${this.get('id')}_${this.get('person_id')}`
		);
		return Buffer.from(token).toString('base64');
	}

	static ByToken (token) {
		const details = Crypt.decrypt(
			Buffer.from(token, 'base64').toString('ascii')
		);
		const parts = details.split('_');
		return Alert.forge({
			id: parts[0]
		});
	}

	static getUsersByGeometry(planId) {
		const sql = `SELECT 
    person.email,
    person.id as person_id,
    alert.id as alert_id
    FROM alert 
    INNER JOIN plan ON ST_Intersects(plan.geom,alert.geom)
    INNER JOIN person ON person.id=alert.person_id
    WHERE plan.id=${planId} AND
    person.status=1
    GROUP BY person.id, alert.id`;
		return Knex.raw(sql);
	}

	static async getAdminAlerts (options, date) {
		const dateString = moment(date).format('YYYY-MM-DD h:mm');
		const sql = `SELECT 
			person.email,
			person.admin,
			person.id as person_id,
			alert.last_email_sent as last_email_sent,
			alert.id as alert_id
			FROM alert
			INNER JOIN person ON person.id=alert.person_id
			WHERE person.admin='1' AND alert.last_email_sent < '${dateString}' OR 
				alert.last_email_sent IS NULL
				LIMIT 1`;

		const res = await Knex.raw(sql);
		const data = res[0][0];
		const alertObj = await Alert.query(qb => {
			qb.where('id', '=', data.alert_id);
		}).fetch({ columns: [
			'address',
			'person_id',
			'geom',
			'radius',
			'place',
			'type',
			'id'
		] });
		return {
			email: data.email,
			alert: alertObj
		};
	}

	static getUsersByPlace (treeId) {
		const sql = `SELECT 
    person.email,
    person.id as person_id,
    alert.id as alert_id
    FROM alert 
    INNER JOIN tree_permit ON tree_permit.place=alert.place
    INNER JOIN person ON person.id=alert.person_id
    WHERE tree_permit.id=${treeId} AND
    person.status=1
    GROUP BY person.id, alert.id`;
		return Knex.raw(sql);
	}

	static getAlertToNotify (userOptions, date) {
		const options = userOptions || {};
		if (!options.limit) {
			options.limit = 1;
		}
		const dateString = moment(date).format('YYYY-MM-DD h:mm');
		return Alert.query(qb => {
			qb.whereRaw(`last_email_sent < '${dateString}' OR last_email_sent IS NULL`);
			qb.where();
		}).fetchAll({
			columns: [
				'address',
				'person_id',
				'geom',
				'radius',
				'place',
				'type',
				'id'
			],
			withRelated: ['person'],
		}).then(res=>{
			if (!res.models[0]) return; 
			return {
				alert: res.models[0],
				email: res.models[0].related('person').get('email')
			};
		}).catch(err=> {
			console.log(err);
		});
	}
}

module.exports = Alert;