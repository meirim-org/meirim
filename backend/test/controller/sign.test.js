/* global test, expect */
const controller = require('../../api/controller/sign');

const req = {};
const res = {};
const next = {};

test('Sign up', () => controller.signup(req, res, next).then((response) => {
  expect(response).toBe('peanut butter');
}));
