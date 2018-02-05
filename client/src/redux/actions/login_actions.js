import Actions from './action_types';
import axios from 'axios';

const API_HOST = 'http://api.meirim.org';
axios.defaults.withCredentials = true; 

const loginActions = {

	login: function (loginForm) {
		return function (dispatch) {
			dispatch({
				type: Actions.LOGIN,
			});
			return axios.post(API_HOST + '/sign/in', loginForm).then(function (result) {
        window.location.href = '/alerts';
			}, function (result) {
				return dispatch({
					type: Actions.LOGIN_ERROR,
					data: result
				});
			});
		};
	},

	signup: function (loginForm) {
		return function (dispatch) {
			dispatch({
				type: Actions.LOGIN,
			});
			return axios.post(API_HOST + '/sign/up', loginForm).then(function (result) {
				return dispatch({
					type: Actions.SIGNUP_SUCCESS,
					data: result
				});
			}, function (result) {
				return dispatch({
					type: Actions.SIGNUP_ERROR,
					data: result
				});
			});
		};
	},

	forgotPassword: function (email) {
		return function (dispatch) {
			dispatch({
				type: Actions.FORGOT_PASS,
			});
			return axios.post(API_HOST + '/password/sendResetToken', email).then(
				function (result) {
					return dispatch({
						type: Actions.FORGOT_PASS_SUCCESS,
						data: result
					});
				},
				function (result) {
					return dispatch({
						type: Actions.FORGOT_PASS_ERROR,
						data: result
					});
				});
		};

	},

	createNewPassword: function (data) {
		return function (dispatch) {
			dispatch({
				type: Actions.CREATE_NEW_PASS,
			});
			return axios.post(API_HOST + '/password/resetWithToken', data).then(
				function (result) {
					return dispatch({
						type: Actions.CREATE_NEW_PASS_SUCCESS,
						data: result
					});
				},
				function (result) {
					return dispatch({
						type: Actions.CREATE_NEW_PASS_ERROR,
						data: result
					});
				});
		};
	}
}

export default loginActions;