$(function () {

  var id = getVars()['id'];
  API.get('plan/' + id)

    .done(function (response) {
      var template = $('#template').html();
      Mustache.parse(template); // optional, speeds up future uses
      var rendered = Mustache.render(template, response.data);
      $('#render').html(rendered);

      // set up the map
      var mymap = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
      }).addTo(mymap);

      var myLayer = L.geoJSON().addTo(mymap);
      myLayer.addData(response.data.geom);

      mymap.fitBounds(myLayer.getBounds());

    });


})

/** helpers */
function getVars() {
  let vars = {};
  window.location.href.replace(location.hash, '').replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function (m, key, value) { // callback
      vars[key] = value !== undefined ? value : '';
    },
  );
  return vars;
}