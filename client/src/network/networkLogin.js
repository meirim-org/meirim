'use strict';

//var NetworkManager = require("network-manager");

var networkLmd = {
    name: "login",

    mapping: {
         'LOGIN':       { method: 'POST',  url: '/api/login', expires: 'ALWAYS', label: ''},
    },

     login: function(loginForm) {
        // return NetworkManager.action(this.mapping.LOGIN, {}, {email: loginForm.email, password: loginForm.password});
     },
};

module.exports = networkLmd;