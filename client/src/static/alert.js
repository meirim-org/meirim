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
  API.post('alert/', {
      address: $('#homeAddress').val(),
      radius: parseInt($('#radiusRange').val())
    })
    .done(function (response) {
      $("#alertTable").trigger("addAlert", [response.data])
    })
    .fail(errorHandler);
  return false;
});

// Radius slider
(function slider() {
  let slider = $('#radiusRange');
  // let rangeCurrentNumber = $('#rangeCurrentNumber')
  let min = $(this).attr('min');
  let max = $(this).attr('max');
  slider.on('change', function () {
    var val = 1 - ($(this).val() - min) / (max - min);
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
    button = $("<button />")
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

function redirectTo(path) {
  window.location = path;
}

function errorHandler(xhr, status, errorThrown) {
  var goToLoginText = "תרצו להכנס למערכת או להרשם?";
  switch (xhr.status) {
    case 403:
      if (confirm(xhr.responseJSON.data + "\n" + goToLoginText)) {
        redirectTo("/login");
      }
      break;
    default:
      errorMessage("Sorry, there was a problem!\n" + xhr.status);
      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
      break;
  }
};

function errorMessage(message) {
  alert(message);
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

  // load alerts to the table
  API.get('alert').done(function (response) {
    var table = $("#alertTable");
    let alerts = response.data;

    for (let i = 0; i < alerts.length; i++) {
      table.trigger("addAlert", [alerts[i]]);
    }
  }).fail(errorHandler);
});