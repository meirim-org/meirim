const axios = require('axios');
const config = process.env.REACT_APP_BASE_API_URL

const instance = axios.create({
    baseURL: `${config}/funding`
})

module.exports = {
    // need to have the following funcitons- get instance token, 
    getPaymentURL: (options) => {
      return instance.get('/paymentLink', {
        params: {
          amount: options.amount,
          monthly: options.monthlyPayment ? '1' : ''
        }
      }).then(res => res.data.data);
    },

    getFundingStats: (options) => {
      return instance.get('/stats').then(res => res.data.data);
    },

    saveTransaction: (options) => {
      return instance.post('/', {
        yaad_id: options.yaadId,
        hk_id: options.hkId,
        amount: options.amount,
        redirect_params: options.redirectParams
      }).then(res => res.status === 'OK');
    },
};