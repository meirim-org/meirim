const turf = require('turf');
const fs = require('fs');
const path = require('path');
const Tag = require('../../model/tag');
const Log = require('../../lib/log');

const getTagsResources = async () => {

    const tagsInDb = await Tag.fetchAll({
        columns: ['id', 'name']
    });

    const tagNameToTagId = {};
    for (const model of tagsInDb.models) {
        tagNameToTagId[model.attributes.name] = model.id;
    }

    let streetNames;
    try {
        streetNames = fs.readFileSync('street_names.csv', 'utf8');
        streetNames = streetNames.split('\n');
        // remove the header
        streetNames = new Set(streetNames.slice(1));
    } catch (err) {
        Log.error(err);
        streetNames = new Set();
    }

    return {
        tagNameToTagId: tagNameToTagId,
        streetNames: streetNames
    };

};

module.exports = {
    getTagsResources
};