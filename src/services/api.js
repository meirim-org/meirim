const axios = require('axios');
const config = require('../config.json');

const instance = axios.create(config.axios);

module.exports = {
  get: (path,data,options) => instance
    .get(path,{params:data},options)
    .then(results => results.data),
  post: (path,data,options) => instance
    .post(path, data,options)
    .then(results => results.data)
}