import api from '../../services/subscriptionPlansApi';

export const saveTransaction = async (options) => {
	try {
		const response = await api.saveTransaction({ ...options });

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
