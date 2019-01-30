// UI elements
// logout button
$("#logout").on("click", function () {
  API.post('sign/out/').done(function () {
    redirectTo("/");
  })
});

//form submit button
$("#addNewAlert").on("submit", function () {

  var mandatoryFieldsMessage = 'יש להזין כתובת בשדה';
  if (!$('#homeAddress').val()) {
    return errorMessage(mandatoryFieldsMessage)
  }
  $("#addNewAlert").attr('disabled', true);
  API.post('alert/', {
      address: $('#homeAddress').val(),
      radius: parseInt($('#radiusRange').val())
    })
    .done(function (response) {
      $("#alertTable").trigger("addAlert", [response.data]);
      $("#addNewAlert").attr('disabled', false);

    })
    .fail(errorHandler);
  return false;
});

function addAlertToMap(alert){

  // creating a circle from the box to display it
  var center = turf.centroid(alert.geom);
  var coords = [center.geometry.coordinates[1], center.geometry.coordinates[0]];
  //var coords = turf.flip(center);
  var c = L.circle(coords, {
    radius: (alert.radius * 1000)
  });
  c.alertId = alert.id;
  c.transparentLayerId = L.geoJSON(alert.geom).addTo(transparentLayer)['_leaflet_id'];
  console.log('the transparent id is '+c.transparentLayerId );
  c.bindTooltip(alert.address+", "+ alert.radius+" "+' ק"מ').openTooltip();
  c.addTo(layer);

  // adding the box to the transaparent layer
  // getting the id of the polygon in the t.layer
  map.fitBounds(transparentLayer.getBounds());
}

function removeAlertFromMap(alertId){

  // removing the circle
  layer.eachLayer((l)=>{
    if(l.alertId===alertId){
      transparentLayer.removeLayer(l.transparentLayerId);
      layer.removeLayer(l);
    }
  })

  map.fitBounds(transparentLayer.getBounds());
}

// Radius slider
(function slider() {
  let slider = $('#radiusRange');
  // let rangeCurrentNumber = $('#rangeCurrentNumber')
  let min = $(slider).attr('min');
  let max = $(slider).attr('max');
  slider.on('change', function () {
    var val = 1 - ($(slider).val() - min) / (max - min);
    $("#rangeCurrentNumber").html($(slider).val());
    $(this).css('background-image',
      '-webkit-gradient(linear, left top, right top, ' +
      'color-stop(' + val + ', #C5C5C5), ' +
      'color-stop(' + val + ', #005cbf)' +
      ')',
    );
    // rangeCurrentNumber.html(this.value);
  });
})();

// alert table events
$("#alertTable").bind({
  deleteAlert: function (currentEvent, button) {
    let row = $(button).closest("tr");
    let id = $(button).data('alert');
    if (!id) return;
    API.delete("alert/" + id)
      .done(function () {
       // row.fadeOut().complete(function () {
          row.remove();
          removeAlertFromMap(id);
        //});
      })
      .fail(errorHandler);
  },
  addAlert: function (event, alert) {
    var table = $("#alertTable");
    table.css("display", "table");
    $("#map").css('display', 'block');
    $("#noAlertsMessage").css('display', 'none');
    var button = $("<button />")
      .addClass("delete")
      .attr("alt", "מחק התראה")
      .on("click", function (e) {
        table.trigger("deleteAlert", [this])
      })
      .data('alert', alert.id);
    tr = $("<tr />")
      .css("display", "none")
      .append($("<td />").html(alert.address))
      .append($("<td />").html(alert.radius + ' ק"מ'))
      .append($("<td />").append(button));
    table.append(tr);
    tr.fadeIn();

    addAlertToMap(alert);
  },
  init: function () {
    $("#alertTable").css("display", "none");
    $("#map").css("display", "none");
  }
});


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

// initialize view on page load
$(document).ready(function () {

  // activate user account
  let vars = getVars();
  if (vars['activate']) {
    API.post("sign/activate/", {
        token: vars['activate']
      })
      .done(function (response) {
        var confirmEmailMessage = 'המשתמש אומת במערכת, ברוכים הבאים';
        errorMessage(confirmEmailMessage);
      })
      .fail(errorHandler);
  }

  $("#alertTable").trigger("init");

  // initializing all the map things
  map = L.map('map');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
    id: 'mapbox.streets',
  }).addTo(map);

  layer = L.featureGroup();
  transparentLayer = L.geoJSON()
  layer.addTo(map);

  // load alerts to the table
  API.get('alert').done(function (response) {
    var table = $("#alertTable");
    let alerts = response.data;

    if(alerts && alerts.length > 0){
      $("#noAlertsMessage").remove();
    }
    for (let i = 0; i < alerts.length; i++) {
      table.trigger("addAlert", [alerts[i]]);
    }
  }).fail(errorHandler);
});