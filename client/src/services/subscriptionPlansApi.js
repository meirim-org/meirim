const axios = require('axios');
const config = process.env.CONFIG.axios;

const instance = axios.create({
	baseURL: `${config.baseURL}/subscription_plans`,
});

module.exports = {
	saveTransaction: (options) => {
		return instance
			.post('/', {
				yaad_id: options.yaadId,
				hk_id: options.hkId,
				amount: options.amount,
				person_id: options.personId,
				redirect_params: options.redirectParams,
			})
			.then((res) => res.status === 'OK');
	},
	cancelSubscription: (options) => {

	}
};
