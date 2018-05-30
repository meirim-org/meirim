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
        row.fadeOut().complete(function(){
          row.remove();
        });
      })
      .fail(errorHandler);
  },
  addAlert: function (event, alert) {
    var table = $("#alertTable");
    table.css("display", "table");
    var button = $("<button />")
      .addClass("delete")
      .on("click", function (e) {
        table.trigger("deleteAlert", [this])
      })
      .data('alert', alert.id);
    tr = $("<tr />")
      .css("display", "none")
      .append($("<td />").html(alert.address))
      .append($("<td />").html(alert.radius+ ' ק"מ'))
      .append($("<td />").append(button));
    table.append(tr);
    tr.fadeIn();
  },
  init: function() {
    console.log(3);
    $("#alertTable").css("display", "none");
  }
});

/**
 * Object to manage the communication with the backend
 */
var API = {
  Apibase: 'http://api.meirim.org/',
  get: function (path, data) {
    return this.request({
      type: 'GET',
      url: this.Apibase + path,
      data: data
    });
  },
  post: function (path, data) {
    return this.request({
      type: 'POST',
      url: this.Apibase + path,
      data: JSON.stringify(data)
    });
  },
  delete: function (path) {
    return this.request({
      type: 'DELETE',
      url: this.Apibase + path
    });
  },
  request: function (params) {
    let settings = Object.assign({
      dataType: 'json',
      async: true,
      xhrFields: {
        withCredentials: true
      },
      contentType: 'application/json'
    }, params);
    return $.ajax(settings);
  }
}

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

  // load alerts to the table
  API.get('alert').done(function (response) {
    var table = $("#alertTable");
    let alerts = response.data;

    for (let i = 0; i < alerts.length; i++) {
      table.trigger("addAlert", [alerts[i]]);
    }
  }).fail(errorHandler);
});