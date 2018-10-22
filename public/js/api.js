/**
 * Object to manage the communication with the backend
 */
const API = {
  // for dev environment
  Apibase: location.hostname !== "localhost" ? 'https://api.meirim.org/' : 'http://localhost:3000/',
  get_promise: function (path) {
    return new Promise((resolve, reject) => {
      this.get(path)
        .done(response => resolve(response))
        .catch(error => reject(error));

    })
  },
  get: function (path) {
    return this.request({
      type: 'GET',
      url: this.Apibase + path
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
    const settings = Object.assign({
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
        redirectTo("/#login");
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

function loadTemplate(path) {
  const settings = {
    type: 'GET',
    url: path,
    dataType: 'text',
    async: true,
    contentType: 'text/plain',
  };

  return new Promise((resolve, reject) =>
    $.ajax(settings)
      .done(response => resolve(response))
      .catch(error => reject(error)));
}

function errorMessage(message) {
  alert(message);
}

function getParams() {
  return window.location.search.slice(1)
    .split('&')
    .reduce(function _reduce( /*Object*/ a, /*String*/ b) {
      b = b.split('=');
      a[b[0]] = decodeURIComponent(b[1]);
      return a;
    }, {});
}

