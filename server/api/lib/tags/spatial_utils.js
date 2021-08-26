const turf = require('turf');


// if they intersect, returns the area of the intersection in sqm
// if they don't intersect, returns undefined
const intersectMultiPolys = (multiPoly1, multiPoly2) => {
    const multiPolyIntoPolys = (multiPoly) => {

        // when reading multipolygon from the db, the "geometry" field can disappear for some reason
        if ('geometry' in multiPoly) {
            if (multiPoly.geometry.coordinates.length === 1) {
                return [turf.polygon([multiPoly.geometry.coordinates[0]])];
            }
            else {
                return multiPoly.geometry.coordinates.map(poly => turf.polygon(poly));
            }
        }

        else {
            if (multiPoly.coordinates.length === 1) {
                return [turf.polygon([multiPoly.coordinates[0]])];
            }
        else {
                return multiPoly.coordinates.map(poly => turf.polygon(poly));
            }
        }

    };

    const polys1 = multiPolyIntoPolys(multiPoly1);
    const polys2 = multiPolyIntoPolys(multiPoly2);

    let areaOfIntersection = 0;

    for (const poly1 of polys1) {
        for (const poly2 of polys2) {
            const intersection = turf.intersect(poly1, poly2);

            if (intersection !== undefined) {
                areaOfIntersection += turf.area(intersection);
            }
        }
    }

    if (areaOfIntersection === 0) {
        return undefined;
    }

    return areaOfIntersection;
};


// if they intersect, returns the area of the intersection in sqm
// if they don't intersect, returns null
const intersectPolyOrMultiPolyWithMultiPoly = (polyOrMultiPoly, multiPoly) => {
    if (polyOrMultiPoly.type === 'MultiPolygon') {
        return intersectMultiPolys(polyOrMultiPoly, multiPoly);
    }
    else {
        return intersectMultiPolys(turf.multiPolygon(polyOrMultiPoly.coordinates), multiPoly);
    }
};

module.exports = {
    intersectPolyOrMultiPolyWithMultiPoly
};