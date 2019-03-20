function up(knex, Promise) {
  const remove = `update plan set PL_NUMBER=concat(PL_NUMBER,"_dup_") where id in 
     (select id from (select id from plan group by PL_NUMBER having count(*) >1) as c)`;
  const next = () => knex.raw(remove)
    .then((res) => {
      if (res[0].affectedRows) {
        return next(remove);
      }
      return Promise.resolve();
    });
  return next()
    .then(() => knex.raw('ALTER TABLE `plan` ADD UNIQUE(`PL_NUMBER`)'))
    .then(() => knex.raw('ALTER TABLE plan DROP INDEX OBJECTID'))
    .catch(e => console.log(e));
}

exports.up = up;

exports.down = function (knex, Promise) {

};
