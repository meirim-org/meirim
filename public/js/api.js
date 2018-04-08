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