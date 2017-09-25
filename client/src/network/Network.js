//var NetworkManager = require('network-manager');

var base = '';

var options = {};
options.retries = 1;
// if (typeof csrfToken !== "undefined")
//     options.csrfToken = csrfToken;
if (base)
    options.baseUrl = base;


//NetworkManager.init(options);

//if (typeof sessionStorage != 'undefined')
  //  NetworkManager.setStorage(sessionStorage);

var Network = {
    registerModule: function(module) {
        if(!module || !module.hasOwnProperty("name") || !module.hasOwnProperty("mapping") ){
            console.error("Network, module must contain a name and mapping");
            return;
        }

        this[module.name] = module;
    },

    apiBase: base

};

module.exports = Network;