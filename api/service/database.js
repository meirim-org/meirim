const Knex = require('knex')({
  client: Config.get('database.client'),
  connection: Config.get('database.connection'),
  debug: Config.get('debug.database'),
});
const Bookshelf = require('bookshelf')(Knex);
const Config = require('../lib/config');

Bookshelf.plugin(['visibility', 'pagination']);
Bookshelf.plugin(require('../lib/bookshelf-mysql-gis'));

Bookshelf.plugin('pagination');

module.exports = {
  Bookshelf,
  Knex,
};
