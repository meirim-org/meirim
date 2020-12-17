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

module.exports.init = () => {
    return new Promise((resolve, reject) => {
        if (window.google) {
            resolve(window.google);
        } else {
            loadScript(`https://maps.googleapis.com/maps/api/js?language=iw&libraries=places&key=${process.env.CONFIG.mapsApiKey}`, () => {
                if (window.google) {
                    resolve(window.google);
                } else {
                    reject('failed to load google library');
                }
            });
        }
    });
};

module.exports.autocomplete = (input) => {
    if (!window.google) {
        return Promise.reject('location service not initialized');
    } else {
        const autocompleteService = new window.google.maps.places.AutocompleteService()

        return new Promise((resolve, reject) => {
            autocompleteService.getPlacePredictions({input, componentRestrictions: {country: 'il'}}, (results, status) => {
                if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
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
    }
};

module.exports.getPlaceLocation = (placeId) => {
    if (!window.google) {
        return Promise.reject('location service not initialized');
    } else {
        const geocoder = new window.google.maps.Geocoder();

        return new Promise((resolve, reject) => {
            geocoder.geocode({placeId}, (results, status) => {
                if (status !== window.google.maps.GeocoderStatus.OK) {
                    reject(status);
                } else {
                    resolve(results[0].geometry.location);
                }
            });
        });
    }
};

