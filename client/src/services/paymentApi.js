const axios = require('axios');
const config = process.env.CONFIG.axios;

const instance = axios.create({
    baseURL: `${config.baseURL}/funding`
})

module.exports = {
    // need to have the following funcitons- get instance token, 
    getPaymentURL: (options) => {
      return instance.get('/paymentLink', {
        params:{ 
          amount:options.amount,
          monthly:true
        }
      }).then(res=>{return res.data.data})
    }
};