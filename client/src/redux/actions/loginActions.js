
import Actions			from './actionTypes';
import axios            from 'axios';
// import config           from 'config';

var api='http://api.meirim.org';

const loginActions = {

    login: function (loginForm){
        return function (dispatch) {
            dispatch({
                type: Actions.LOGIN,
            });
            return  axios.post(api + '/sign/in', loginForm).then(function (result) {
                return dispatch({
                    type: Actions.LOGIN_SUCCESS,
                    data: result
                });
            }, function (result) {
                return dispatch({
                    type: Actions.LOGIN_ERROR,
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
			return axios.post(api + '/password/sendResetToken', email).then(
				function (result) {
					return dispatch({
						type: Actions.FORGOT_PASS_SUCCESS,
						data: result
					});
				}, function (result) {
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
			return axios.post(api + '/password/resetWithToken', data).then(
				function (result) {
					return dispatch({
						type: Actions.CREATE_NEW_PASS_SUCCESS,
						data: result
					});
				}, function (result) {
					return dispatch({
						type: Actions.CREATE_NEW_PASS_ERROR,
						data: result
					});
				});
		};
	}
}

export default loginActions;