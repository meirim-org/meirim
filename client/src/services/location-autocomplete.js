const http = require('axios');
const {URL} = require('../config.json').locationAutocomplete;


module.exports.autocomplete = function (text){
    return http.get(`${URL}json?input=${text}&key=AIzaSyCzVtoN2pkRhbNz3AZYOFZTSVLcbzCQIr0`, 
     {
          headers:{
        'Access-Control-Allow-Origin': '*'
    }}).then(res=>{
        return res.data.predictions.map(p=>p.description)
    })
};

