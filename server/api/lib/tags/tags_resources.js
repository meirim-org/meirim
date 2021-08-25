const turf = require('turf');
const fs = require('fs');
const path = require('path');


class TagsResources {

    constructor() {
        // list of objects, each object is {geom, name}
        this.bottlenecks = JSON.parse(fs.readFileSync(path.join(__dirname,
                                                                      'ecological_bottlenecks',
                                                                      'natural_corridors_bottlenecks_israel.geojson')))
            .features.map(entry => { return {
                geom: turf.multiPolygon(entry.geometry.coordinates),
                name: entry.properties.title
            }});
    }

}

module.exports = {
    TagsResources
};