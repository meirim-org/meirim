const {baseURL} = require('../config.json').locationServices;

const loadScript = (url, callback) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';

    if (script.readyState) {
      script.onreadystatechange = function() {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = () => callback();
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
};

const getGoogleObj = () => {
    return new Promise((resolve, reject) => {
        if (window.google) {
            resolve(window.google);
        } else {
            loadScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_KEY}&language=iw&libraries=places`, () => {
                if (window.google) {
                    resolve(window.google);
                } else {
                    reject('failed to load google library');
                }
            });
        }
    });
};

module.exports.autocomplete = function (text) {
    return getGoogleObj().then((google) => {
        const autocompleteService = new google.maps.places.AutocompleteService()

        return new Promise((resolve, reject) => {
            autocompleteService.getPlacePredictions({input: text, componentRestrictions: {country: 'il'}}, (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    reject(status);
                } else {
                    resolve(results.map((r) => {
                        return {
                            label: r.description,
                            id: r.place_id
                        };
                    }));
                }
            });
        });
    });
};

module.exports.getPlaceData = function (placeId) {
    return getGoogleObj().then((google) => {
        const geocoder = new google.maps.Geocoder();

        return new Promise((resolve, reject) => {
            geocoder.geocode({placeId}, (results, status) => {
                if (status !== google.maps.GeocoderStatus.OK) {
                    reject(status);
                } else {
                    resolve(results[0].geometry.location);
                }
            })
        })
    });
};

