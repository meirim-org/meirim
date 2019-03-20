/* global test, expect, beforeAll, afterAll */
const controller = require('../../api/controller/sign');
const Email = require('../../api/service/email');
const Exception = require('../../api/model/exception');
const Person = require('../../api/model/person');

const email = `test${new Date().getTime()}@meirim.org`;
const password = '123456';

beforeAll(() => Email.init());

afterAll(() => function () {
  return Person.forge({
    email,
  }).destroty();
});

const req1 = {
  body: {
    email,
    password,
  },
  session: {},
};
const res = {};
const next = {};

test('Sign up should work', () => controller
  .signup(req1)
  .then((person) => {
    expect(person).toBeTruthy();
    expect(person.get('email')).toBe(req1.body.email);
    expect(person.get('firstName')).toBeNull();
    expect(person.get('lastName')).toBeNull();
    expect(req1.session.person).toMatchObject(person);
    return person;
  }), 10000);

const req5 = {
  body: {
    email: 'wrong@emaildns',
    password,
  },
  session: {},
};

test('Sign up with wrong email should fail', () => {
  expect(controller.signup(req5))
    .rejects.toThrow(Exception.BadRequest);
}, 10000);

test('Activate account shouls work', () => Person.forge({
  email,
})
  .fetch()
  .then(user => controller.activate({
    body: {
      token: user.getActivationToken(),
    },
    session: {},
  }, res, next))
  .then((response) => {
    expect(response).toBeTruthy();
    return response;
  }), 10000);

const req2 = {
  body: {
    email,
    password,
  },
  session: {},
};
test('Sign in should work', () => controller.signin(req2, res, next)
  .then((response) => {
    expect(response).toBeTruthy();
    expect(req2.session.person).toBeTruthy();
    return response;
  }), 10000);

const req3 = {
  body: {
    email: email.toUpperCase(),
    password,
  },
  session: {},
};
test('Sign in should works with uppercase email', () => controller.signin(req3, res, next)
  .then((response) => {
    expect(response).toBeTruthy();
    expect(req3.session.person).toBeTruthy();
    return response;
  }), 10000);


test('Sign in should fail with wrong password', () => {
  expect(controller
    .signin({
      body: {
        email,
        password: 'wrongPw',
      },
      session: {},
    }))
    .rejects.toThrow(Exception.BadRequest);
});

test('Sign in should fail without email', () => {
  expect(() => controller
    .signin({
      body: {
        password: 'wrongPw',
      },
      session: {},
    }))
    .toThrow();
});

test('Sign in should fail without password', () => {
  expect(() => controller
    .signin({
      body: {
        email,
      },
      session: {},
    }))
    .toThrow();
});

test('Sign out shoud work', () => {
  expect(controller
    .signout({
      body: {},
      session: {
        destroy: () => true,
      },
    }))
    .toBeTruthy();
});
