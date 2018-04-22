
exports.up = function(knex, Promise) {
   return knex
    .raw('ALTER TABLE `plan` ADD PRIMARY KEY(`id`);')
    .then(() => knex.raw('ALTER TABLE `plan` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;'))
    .then(() => knex.raw('ALTER TABLE `plan` ADD UNIQUE(`OBJECTID`);'))
};

exports.down = function(knex, Promise) {
  
};
