'use strict';
const Passport = require("passport");
const Strategy = require('passport-local').Strategy;
const Person = require('./person');
// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
Passport.use(new Strategy(function (email, password, cb) {
	Person.login(email, function findByEmailSuccess(err, fetchedPerson) {
		if (err) {
			return cb(err);
		}
		if (!fetchedPerson) {
			return cb(null, false);
		}
		if (fetchedPerson.get("password") != password) {
			return cb(null, false);
		}
		return cb(null, fetchedPerson);
	});
}));
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
Passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});
Passport.deserializeUser(function (id, cb) {
	db.users.findById(id, function (err, user) {
		if (err) {
			return cb(err);
		}
		cb(null, user);
	});
});
module.exports = Passport;
