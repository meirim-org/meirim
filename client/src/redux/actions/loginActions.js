
import Actions			from './actionTypes';
import Network          from '../../network/Network';

const loginActions = {

    login: function (loginForm){
        return function (dispatch) {
            dispatch({
                type: Actions.LOGIN,
            });
            return Network.login.login(loginForm).$promise.then(function (result) {
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
    }
}

export default loginActions;