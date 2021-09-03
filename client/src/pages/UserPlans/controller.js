
import api from 'services/api';

export const fetchUserPlans = async () => {
	try {
		const response = await api.get('plan/user');

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

export const subscribeToPlan = async () => {
	try {
		const response = await api.get('plan/user');

		return response;
	} catch (err) {
		throw new Error(err);
	}
};