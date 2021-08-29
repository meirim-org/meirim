const turf = require('turf');
const fs = require('fs');
const path = require('path');
const Tag = require('../../model/tag');


const getTagsResources = async () => {

    const tagsInDb = await Tag.fetchAll({
        columns: ['id', 'name']
    });

    const tagNameToTagId = {};
    for (const model of tagsInDb.models) {
        tagNameToTagId[model.attributes.name] = model.id;
    }

    return {
        tagNameToTagId: tagNameToTagId
    };

};

module.exports = {
    getTagsResources
};