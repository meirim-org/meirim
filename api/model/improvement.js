const Model = require('./base_model');
const Exception = require('./exception');
const Participation = require('./participation');

class Improvement extends Model {
    get rules() {
        return {
            person_id: ['required', 'integer'],
            participation_id: ['required', 'integer'],
            approved: 'boolean',
            reviewed: 'timestamp',
            title: ['required', 'string'],
            description: ['required', 'string'],
            benefits: 'string',
            drawbacks: 'string'
        };
    }

    get tableName() {
        return 'improvement';
    }

    get hasTimestamps() {
        return true;
    }

    get hidden() {
        return ['person_id'];
    }

    get booleanFields() {
        return ['approved'];
    }

    defaults() {
        return {
            approved: false
        };
    }

    canRead(session) {
        return Promise.resolve(this);
    }

    static canCreate(session) {
        if (!session.person) {
            throw new Exception.NotAllowed('Must be logged in');
        }

        return Promise.resolve(this);
    }

    canEdit(session) {
        if (!session.person || session.person.id !== this.get('person_id')) {
            throw new Exception.NotAllowed('You cannot edit this improvement');
        }

        return Promise.resolve(this);
    }

    participation() {
        return this.belongsTo(Participation);
    }

    static byParticipation(participationId) {
        if (!participationId) {
            throw new Exception.BadRequest('Must provide participation id');
        }
    
        return this.query('where', 'participation_id', '=', participationId)
            .query((qb) => {
                qb.orderBy('id', 'DESC');
            })
            .fetchAll();
    }
}

module.exports = Improvement;
