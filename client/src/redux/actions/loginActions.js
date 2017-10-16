
import Actions			from './actionTypes';
import axios            from 'axios';
// import config           from 'config';

var api='http://api.meirim.org';

const loginActions = {

    login: function (loginForm){
        return function (dispatch) {
            console.log("in the calling action");
            dispatch({
                type: Actions.LOGIN,
            });
            return  axios.post(api + '/sign/in', loginForm).then(function (result) {
                console.log("success");
                return dispatch({
                    type: Actions.LOGIN_SUCCESS,
                    data: result
                });
            }, function (result) {
                console.log("failer");
                return dispatch({
                    type: Actions.LOGIN_ERROR,
                    data: result
                });
            });
        };
    }
}

export default loginActions;