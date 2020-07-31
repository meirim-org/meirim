const Model = require('./base_model');
const Exception = require('./exception');
const Improvement = require('./improvement');

class ImprovementComment extends Model {
    get rules() {
        return {
            person_id: ['required', 'integer'],
            improvement_id: ['required', 'integer'],
            approved: 'boolean',
            reviewed: 'timestamp',
            title: ['required', 'string'],
            description: ['required', 'string']
        };
    }

    get tableName() {
        return 'improvement_comment';
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
            throw new Exception.NotAllowed('You cannot edit this comment');
        }

        return Promise.resolve(this);
    }

    improvement() {
        return this.belongsTo(Improvement);
    }

    static byImprovement(improvementId) {
        if (!improvementId) {
            throw new Exception.BadRequest('Must provide improvement id');
        }
    
        return this.query('where', 'improvement_id', '=', improvementId)
            .query((qb) => {
                qb.orderBy('id', 'DESC');
            })
            .fetchAll();
    }
}

module.exports = ImprovementComment;
