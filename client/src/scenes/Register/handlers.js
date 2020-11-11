import api from '../../services/api';

export const registerUser = async (values) => {
	const {
		name, password, email, aboutme, type, address,
	} = values;
	const requestData = {
		name,
		password,
		email,
		about_me: aboutme,
		type,
		address,
	};
	try {
		const response = await api.post('/sign/up', { ...requestData });

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

export const authenticateEmail = async ({ email }) => {
	try {
		const response = await api.post('/sign/auth/email', {
			email,
		});

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
