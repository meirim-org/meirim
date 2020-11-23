import api from '../../services/api';
import { AUTHENTICATE_EMAIL, SIGN_UP } from '../../router/contants'

export const resendActivationLinkToEmail = async (email) => {
	const requestData = { email };
	try {
		const response = await api.post(SIGN_UP, { ...requestData });

		return response;
	} catch (err) {
		throw new Error(err);
	}
}

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
