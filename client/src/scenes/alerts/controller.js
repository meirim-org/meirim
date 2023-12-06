import api from '../../services/subscriptionPlansApi';

export const saveTransaction = async (options) => {
	try {
		return await api.saveTransaction({ ...options });
	} catch (err) {
		throw new Error(err);
	}
};

export const createPaymentLink = async (options) => {
	try {
		return await api.getPaymentURL({ ...options });
	} catch (err) {
		throw new Error(err);
	}
};
