'use strict';

var Actions  = require ('../actions/actionTypes');

var loginReducer = function(state, action) {
    switch (action.type){
        case Actions.LOGIN_SUCCESS:
            var stateCopy =Object.assign({}, state );
            stateCopy.response = action.data;
            console.log(stateCopy);
            return stateCopy;

        case Actions.LOGIN_ERROR:
            var stateCopy =Object.assign({}, state );
            stateCopy.response = action.data;
            console.log("failed");
            return stateCopy;

        default:
            return state || {};
    }

};

module.exports = loginReducer;
