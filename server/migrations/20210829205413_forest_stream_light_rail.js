const streamsTag = require('../api/lib/tags/streams');
const forestsTag = require('../api/lib/tags/forests');
const lightRailTag = require('../api/lib/tags/light_rail');

exports.up = async function(knex) {
    const tbl = knex.table('tag');

    await tbl.insert({name: streamsTag.TAG_NAME, display_name: streamsTag.TAG_DISPLAY_NAME});
    await tbl.insert({name: forestsTag.TAG_NAME, display_name: forestsTag.TAG_DISPLAY_NAME});
    await tbl.insert({name: lightRailTag.TAG_NAME, display_name: lightRailTag.TAG_DISPLAY_NAME});
};

exports.down = async function(knex) {
    const tbl = knex.table('tag');

    await tbl.where('name', streamsTag.TAG_NAME).del();
    await tbl.where('name', forestsTag.TAG_NAME).del();
    await tbl.where('name', lightRailTag.TAG_NAME).del();
};
