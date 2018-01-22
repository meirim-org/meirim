import _ from 'lodash';

const keys = [
	'LOGIN',
	'LOGIN_SUCCESS',
	'LOGIN_ERROR',
	'SIGNUP',
	'SIGNUP_SUCCESS',
	'SIGNUP_ERROR',
	'FORGOT_PASS',
	'FORGOT_PASS_SUCCESS',
	'FORGOT_PASS_ERROR',
	'CREATE_NEW_PASS',
	'CREATE_NEW_PASS_SUCCESS',
	'CREATE_NEW_PASS_ERROR'
];

export default _.keyBy(keys);