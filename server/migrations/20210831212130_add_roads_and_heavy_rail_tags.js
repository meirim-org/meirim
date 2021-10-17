const heavyRailTag = require('../api/lib/tags/heavy_rail');
const roadsTag = require('../api/lib/tags/roads');

exports.up = async function(knex) {
    const tbl = knex.table('tag');

    await tbl.insert({name: heavyRailTag.TAG_NAME});
    await tbl.insert({name: roadsTag.TAG_NAME});
};

exports.down = async function(knex) {
    const tbl = knex.table('tag');

    await tbl.where('name', heavyRailTag.TAG_NAME).del();
    await tbl.where('name', roadsTag.TAG_NAME).del();
};
