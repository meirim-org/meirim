
exports.up = function(knex, Promise) {
  return knex.schema.table('plan', (table) => {
    table.text('status');
  })
  .then(()=> {
  
    const sql = `update plan 
      set \`status\` = substring(\`data\`, locate('"STATION_DESC":',\`data\`)+17 , locate('"PL_AREA_DUNAM"',\`data\`)-locate('"STATION_DESC":',\`data\`)-20)`;
      return knex.raw(sql);
  })
};

exports.down = function(knex, Promise) {
  
};
