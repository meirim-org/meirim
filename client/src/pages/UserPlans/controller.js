
import api from 'services/api';

export const fetchUserPlans = async (id) => {
	try {
		const response = await api.post('plan/user', { userId: id });

		return response;
	} catch (err) {
		throw new Error(err);
	}
};