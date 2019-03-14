/* global test, expect, beforeAll, afterAll */
const controller = require('../../api/controller/alert');
const Person = require('../../api/model/alert');
const Email = require('../../api/service/email');
const Exception = require('../../api/model/exception');

let person = false;

beforeAll(() => Email
  .init()
  .then(() => {
    person = Person.forge({
      email: 'test@meirim.org',
      password: 'xxxx',
      id: 1,
    });
    return true;
  }));

test('Create alert should work', () => controller
  .create({
    body: {
      address: 'ben yehuda 32 tel aviv',
    },
    session: {
      person,
    },
  })
  .then((results) => {
    expect(results).toBeTruthy();
    return true;
  }), 10000);
