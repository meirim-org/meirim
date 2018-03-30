const Controller = require('../controller/controller');
const Person = require('../model/person');
const Exception = require('../model/exception');
const Log = require('../lib/log');
const Email = require('../service/email');

class PasswordController extends Controller {
  static sendResetToken(req) {
    if (!req.body.email) {
      throw new Exception.BadRequest('No email provided');
    }
    const email = req.body.email.toLowerCase().trim();
    Log.debug('Forgot password:', email);

    return Person.forge({
      email,
    }).fetch().then((person) => {
      if (!person) {
        throw new Exception.NotFound('Email not found');
      }
      return Email.resetPasswordToken(person);
    });
  }
  static resetWithToken(req) {
    if (!req.body.token) {
      throw new Exception.BadRequest('No token provided');
    }
    if (!req.body.password) {
      throw new Exception.BadRequest('No password provided');
    }

    return Person.resetPasswordByToken(req.body.token, req.body.password);
  }
}
module.exports = new PasswordController(Person);
