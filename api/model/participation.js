const Model = require('./base_model');
const Exception = require('./exception');

class Participation extends Model {
    get rules() {
        return {
            title: ['required', 'string'],
            description: 'string',
            content: 'string'
        };
    }

    get tableName() {
        return 'participation';
    }

    get hasTimestamps() {
        return true;
    }

    canRead(session) {
        return Promise.resolve(this);
    }

    static canCreate(session) {
        throw new Exception.NotAllowed('This option is disabled');
    }
}

module.exports = Participation;
