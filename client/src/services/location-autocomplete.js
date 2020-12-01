const http = require('axios');
const {baseURL} = require('../config.json').locationServices;
const _ = require('lodash')


module.exports.autocomplete = function (text){
    return http.get(`${baseURL}autocomplete/json?input=${text}&components=country:il&language=iw&key=AIzaSyCzVtoN2pkRhbNz3AZYOFZTSVLcbzCQIr0`, 
     {
          headers:{
        'Access-Control-Allow-Origin': '*'
    }}).then(res=>{
        return res.data.predictions.map(p=>{
            return {
                label:_.map(p.terms.splice(0,p.terms.length-1), 'value').join(', '),
                id: p.place_id
            }
        })
    })
};

module.exports.getPlaceData = function (placeId){
    return http.get(`${baseURL}details/json?place_id=${placeId}&key=AIzaSyCzVtoN2pkRhbNz3AZYOFZTSVLcbzCQIr0`, 
     {
          headers:{
        'Access-Control-Allow-Origin': '*'
    }}).then(res=>{
        return res.data
    })
};

