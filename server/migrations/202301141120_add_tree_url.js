exports.up = function(knex) {
    return knex.schema.table('tree_permit', table => {
      table.text('tree_permit_url');
    }).then(() => {
        return knex.raw('UPDATE tree_permit SET tree_permit_url = \'https://www.jerusalem.muni.il/he/residents/environment/improvingcity/trees-conservation/\' WHERE REGIONAL_OFFICE = \'ירושלים\'');
    });
  };

exports.down = async function(knex) {
    await knex.schema.table('tree_permit', table => {
        table.dropColumns('tree_permit_url');
    });
};