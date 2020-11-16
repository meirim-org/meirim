import api from '../../services/api';

const SIGN_UP = '/sign/up'
const AUTHENTICATE_EMAIL = '/sign/auth/email'

export const registerUser = async (values) => {
	const {
		name, password, email, about_me, type, address,
	} = values;
	const requestData = {
		name,
		password,
		email,
		about_me,
		type,
		address,
	};
	try {
		const response = await api.post(SIGN_UP, { ...requestData });

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

export const authenticateEmail = async (email) => {
	try {
		const response = await api.post(AUTHENTICATE_EMAIL, {
			email,
		});

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
