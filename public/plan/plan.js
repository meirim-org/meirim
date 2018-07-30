$(document).ready(() => {
  const id = getParams()['id'];
  const template = $('#template').html();

  Promise.all([
    API.get_promise('plan/' + id),
    loadTemplate('/plan/nav.mustache'),
  ])
  
    .then(([response,navTemplate]) => {
      $('#nav').html(Mustache.render(navTemplate,response));
      $('#render').html(Mustache.render(template,response));

      // set up the map
      const mymap = L.map('map');
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
        id: 'mapbox.streets',
      }).addTo(mymap);
      const myLayer = L.geoJSON().addTo(mymap);
      myLayer.addData(response.data.geom);
      mymap.fitBounds(myLayer.getBounds());
    })
    .then(() => init_comments({
      el: $("#comments"),
      planId: id,
    }))
    .catch(error => console.error(error));
});
