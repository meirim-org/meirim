const Promise = require('bluebird');
const Bcrypt = require('bcrypt');
const Config = require('config');
const verifier = require('email-verify');
const Crypt = require('../lib/crypt');
const Log = require('../lib/log');
const Alert = require('./alert');
const BaseModel = require('./base_model');
const Exception = require('./exception');

const seconds = 1000;

class Person extends BaseModel {
  static get rules() {
    return {
      // firstName: [
      //   'required', 'string'kshelf
      // ],
      // lastName: [
      //   'required', 'string'
      // ],
      email: ['required', 'email'],
      password: ['required', 'string'],
      status: ['required', 'integer'],
      admin: ['integer'],
    };
  }

  get hidden() {
    return ['password', 'admin', 'status'];
  }

  get tableName() {
    return 'person';
  }

  initialize() {
    this.on('creating', this.assignValues);
    this.on('saving', this.hashPassword);
    super.initialize();
  }

  alerts() {
    return this.hasMany(Alert);
  }

  assignValues(model, attrs, options) {
    model.attributes.status = 0;
    model.attributes.email = model.attributes.email.toLowerCase().trim();
    return Person.verifyEmail(model.attributes.email);
  }

  getActivationToken() {
    const data = this.get('email');
    const hashedPassword = Crypt.encrypt(data);
    return Buffer.from(hashedPassword).toString('base64');
  }

  resetPasswordToken() {
    const now = new Date().getTime();
    const data = `${this.get('id')}_${now}`;
    const token = Crypt.encrypt(data);
    return Buffer.from(token).toString('base64');
  }

  static resetPasswordByToken(token, newPassword) {
    const now = new Date().getTime();
    const details = Crypt.decrypt(
      Buffer.from(token, 'base64').toString('ascii'),
    );
    const parts = details.split('_');
    if (parts.length !== 2) {
      throw new Exception.BadRequest('Invalid token');
    }
    const whenGenerated = parseInt(parts[1], 10);

    if (now < whenGenerated) {
      Log.debug('resetPasswordByToken:', whenGenerated, 'is in the future');
      throw new Exception.BadRequest('Invalid token');
    }
    if (now - 7200 * seconds > whenGenerated) {
      Log.debug(
        'resetPasswordByToken:',
        whenGenerated,
        'is ',
        7200 * seconds,
        'in the past',
      );
      throw new Exception.BadRequest(
        'Invalid token: token is valid for 2 hours only. Please generate a new token',
      );
    }
    return Person.forge({
      id: parts[0],
    })
      .fetch()
      .then(person => {
        if (!person) {
          Log.debug('resetPasswordByToken:Person', parts[0], 'not found');
          throw new Exception.BadRequest('Invalid token');
        }
        person.set('password', newPassword);
        Log.debug('Set new password');
        return person.save();
      })
      .then(() => true);
  }

  hashPassword(model) {
    const passwordLength = 6;
    if (!model.hasChanged('password')) {
      Log.debug('Password not hashed');
      return false;
    }
    const password = model.get('password');
    if (password.lenth <= passwordLength) {
      throw new Exception.BadRequest(
        `Password must be at least ${passwordLength} charcters`,
      );
    }
    // hash password
    Log.debug('Password hashed');
    return Bcrypt.hash(model.get('password'), 10).then(hashedPassword =>
      model.set('password', hashedPassword),
    );
  }

  // upload(files) {
  //   return this;
  // }
  checkPassword(password) {
    return Bcrypt.compare(password, this.get('password')).then(res => {
      if (!res) {
        throw new Exception.NotAllowed('Password mismatch');
      }
      return this;
    });
  }

  static canCreate(session) {
    if (session.person) {
      throw new Exception.NotAllowed('Must be signed out');
    }
    return Promise.resolve(Person);
  }

  static activateByToken(token) {
    const data = Buffer.from(token, 'base64').toString('ascii');
    const email = Crypt.decrypt(data);
    return Person.forge({
      email,
    })
      .fetch()
      .then(fetchedPerson => {
        if (!fetchedPerson) {
          throw new Exception.BadRequest('User not found');
        }
        fetchedPerson.set('status', 1);
        return fetchedPerson.save();
      })
      .then(() => true);
  }

  /**
   * Verify and email returning a promise
   * @param {string} email
   */
  static verifyEmail(email) {
    const codes = verifier.verifyCodes;
    return new Promise((resolve, reject) => {
      verifier.verify(
        email,
        { sender: Config.get('email.from_email') },
        (err, info) => {
          Log.debug('Email verifier', info, err);
          if (err) {
            reject(err);
          } else if (info.success) {
            resolve(true);
          } else if (info.code === codes.domainNotFound) {
            reject(new Exception.BadRequest('Email domain not found'));
          } else if (info.code === codes.invalidEmailStructure) {
            reject(new Exception.BadRequest('Email is not valid'));
          } else if (info.code === codes.noMxRecords) {
            reject(
              new Exception.BadRequest(
                "The domain doesn't receive emails. No MX records",
              ),
            );
          } else if (info.code === codes.SMTPConnectionTimeout) {
            reject(new Exception.BadRequest('SMTP Connection Timeout'));
          } else if (info.code === codes.SMTPConnectionError) {
            reject(new Exception.BadRequest('SMTP Connection Error'));
          } else {
            reject(new Exception.BadRequest("Email isn't valid"));
          }
        },
      );
    });
  }
}

module.exports = Person;
