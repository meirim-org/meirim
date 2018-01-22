const Redux = require('redux');

const rootReducer = Redux.combineReducers({
     loginReducer: require('./login_reducer'),
});

module.exports = rootReducer;
