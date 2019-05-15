const Controller = require('./controller');
const Person = require('../model/person');
const Exception = require('../model/exception');
const Log = require('../lib/log');
const Email = require('../service/email');

class SignController extends Controller {
  me(req) {
    if (!req.session.person) {
      throw Exception.NotAllowed('Must be logged in');
    }
    return true;
  }

  signup(req) {
    // check if user exists and not active
    return this.model
      .forge({
        email: req.body.email,
        status: 0,
      })
      .fetch()
      .then((existingPerson) => {
        // if there is an inactive person we send only a mail
        if (existingPerson) {
          Log.debug(
            'Person send activation email to:',
            existingPerson.get('id'),
          );
          return Email.newSignUp(existingPerson);
        }

        // if there is a user but active, this will return an error

        return this.model
          .forge(req.body)
          .save()
          .then((person) => {
            Log.debug('Person create success id:', person.get('id'));
            return Email.newSignUp(person);
          })
          .then(() => this.signin(req));
      });
  }

  activate(req) {
    if (!req.body.token) {
      throw new Exception.BadRequest('No token provided');
    }
    Log.debug('Person Activate token:', req.body.token);
    return Person.activateByToken(req.body.token);
  }

  signin(req) {
    if (!req.body.email) {
      throw new Exception.BadRequest('No email provided');
    }
    if (!req.body.password) {
      throw new Exception.BadRequest('No password provided');
    }

    const email = req.body.email.toLowerCase().trim();
    Log.debug('Try login with email:', email);

    return Person.forge({
      email,
    })
      .fetch()
      .then((person) => {
        if (!person) {
          throw new Exception.NotAllowed('Password mismatch');
        }

        Log.debug('user was found:', person.get('id'));
        return person;
      })
      .then(person => person.checkPassword(req.body.password))
      .then((person) => {
        req.session.person = person;
        Log.debug('user was signedin:', person.get('id'));
        return person;
      });
  }

  signout(req) {
    if (req.session.destroy()) {
      return true;
    }
    return false;
  }
}

module.exports = new SignController(Person);
