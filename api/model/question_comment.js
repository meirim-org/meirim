const Model = require('./base_model');
const Exception = require('./exception');
const Question = require('./question');

class QuestionComment extends Model {
    get rules() {
        return {
            person_id: ['required', 'integer'],
            question_id: ['required', 'integer'],
            approved: 'boolean',
            reviewed: 'timestamp',
            title: ['required', 'string'],
            description: ['required', 'string']
        };
    }

    get tableName() {
        return 'question_comment';
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

    question() {
        return this.belongsTo(Question);
    }

    static byQuestion(questionId) {
        if (!questionId) {
            throw new Exception.BadRequest('Must provide question id');
        }
    
        return this.query('where', 'question_id', '=', questionId)
            .query((qb) => {
                qb.orderBy('id', 'DESC');
            })
            .fetchAll();
    }
}

module.exports = QuestionComment;
