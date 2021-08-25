const turf = require('turf');
const fs = require('fs');
const path = require('path');
const Tag = require('../../model/tag');


const getTagsResources = async () => {

    const bottlenecks = JSON.parse(fs.readFileSync(path.join(__dirname,
        'ecological_bottlenecks',
        'natural_corridors_bottlenecks_israel.geojson')))
        .features.map(entry => { return {
            geom: turf.multiPolygon(entry.geometry.coordinates),
            name: entry.properties.title
    }});

    const tagsInDb = await Tag.fetchAll({
        columns: ['id', 'name']
    });

    const tagNameToTagId = {};
    for (const model of tagsInDb.models) {
        tagNameToTagId[model.attributes.name] = model.id;
    }

    return {
        bottlenecks: bottlenecks,
        tagNameToTagId: tagNameToTagId
    };

};

module.exports = {
    getTagsResources
};