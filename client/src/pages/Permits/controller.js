
import api from 'services/api';

export const fetchPermits = async () => {
	try {
		const response = await api.get('permit');

		return response;
	} catch (err) {
		console.log('err', err);
		throw new Error(err);
	}
};