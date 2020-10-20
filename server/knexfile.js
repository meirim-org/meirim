// Update with your config settings.
const config = require('./api/lib/config');

module.exports = {

  development: {
    client: config.get('database.client'),
    connection: config.get('database.connection'),
  },

  staging: {
    client: config.get('database.client'),
    connection: config.get('database.connection'),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: config.get('database.client'),
    connection: config.get('database.connection'),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
