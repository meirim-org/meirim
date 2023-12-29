const Controller = require('../controller/controller');
const Alert = require('../model/alert');
const Email = require('../service/email');
const Log = require('../lib/log');
const Exception = require('../model/exception');
const alertChecker = require('../utils/alertChecker');
const alertCheckerUpdate = require('../utils/alertCheckerUpdate');

class AlertController extends Controller {
    async create(req, res, next) {
        await alertChecker(req);

        return super.create(req, res, next).then(savedAlert => {
            Email.newAlert(req.session.person, savedAlert)
                .then(() => savedAlert)
                .catch(err => console.error(err));
            // console.log('email sent');
            alertCheckerUpdate(req);
        });
    }

    update(req, res) {
        return super.update(req, res).then(() => {
            alertCheckerUpdate(req);
        });
    }

    delete(req, transaction) {
        return super.delete(req, transaction).then(deletedAlert => {
            alertCheckerUpdate(deletedAlert);
        });
    }

    /**
     * Return person's alerts. Must be logged in.
     * @param {IncomingRequest} req
     */
    browse(req) {
        if (!req.session.person) {
            throw new Exception.NotAllowed('Must be logged in');
        }
        return this.model
            .query('where', 'person_id', '=', req.session.person.id)
            .fetchAll()
            .then((collection) => {
                Log.debug(this.tableName, 'browse success user', req.session.person.id);
                return collection;
            });
    }

    /**
     * Unsubscribe from alert by token, when clicking an unsubscribe
     * link in an email
     * @param {IncomingRequest} req
     */
    unsubscribe(req) {
        return Alert.ByToken(req.params.token)
            .fetch()
            .then((fetchedModel) => {
                if (!fetchedModel) {
                    // return successfully even if alert was not found since
                    // it is probably already unsubscribed
                    return null;
                }

                Log.debug(
                    this.tableName,
                    'unsubscribe success id:',
                    fetchedModel.get('id')
                );
                return fetchedModel.destroy();
            });
    }
}

module.exports = new AlertController(Alert);
