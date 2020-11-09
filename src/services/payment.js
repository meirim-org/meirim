const axios = require('axios');
const config = require('../config.json').paymentServices;

const instance = axios.create({
    baseURL: config.baseURL
  });

module.exports = {
    // need to have the following funcitons- get instance token, 
    getPaymentURL: (options) => {
      return instance.get('/', { 
        params: {
        "action":"APISign",
        "What":"SIGN",
        "KEY":config.apiKey,
        "PassP":config.PassP,
        "Masof":config.masofId,
        "Amount":options.amount,
        "UTF8":"True",
        "UTF8out":"True",
        "Coin":1,
        "sendemail":"True",
        "SendHesh":"True",
        "PageLang":"HEB",
        "tmp":9,
        "Info":"תרומה חד פעמית לעמותת מעירים",
        "Pritim":"True",
       "heshDesc":["", "תרומה%20חד%20פעמית%20לעמותת%20מעירים", "1", `${options.amount}`].join('~'),
    } }, options).then(res=>`${config.baseURL}/?action=pay&${res.data}`)}
};
