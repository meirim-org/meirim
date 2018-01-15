const Actions = require('../actions/action_types').default;

const loginReducer = function (state, action) {

	switch (action.type) {
		case Actions.LOGIN_SUCCESS:
			return Object.assign(state, {
				status: 'logged'
			});

		case Actions.LOGIN_ERROR:
			var stateCopy = Object.assign({}, state);
			stateCopy.response = "ההתחברות נכשלה, אנא נסה/י שנית";
			return stateCopy;

		case Actions.FORGOT_PASS_SUCCESS:
			var stateCopy = Object.assign({}, state);
			stateCopy.response = "מייל עם לינק לקביעת סיסמא חדשה נשלח אליך";
			return stateCopy;

		case Actions.FORGOT_PASS_ERROR:
			var stateCopy = Object.assign({}, state);
			stateCopy.response = "אתחול סיסמא נכשל, אנא נסה/י שנית";
			return stateCopy;

		case Actions.CREATE_NEW_PASS_SUCCESS:
			var stateCopy = Object.assign({}, state);
			stateCopy.response = "סיסמא שונתה בהצלחה";
			return stateCopy;

		case Actions.FORGOT_PASS_ERROR:
			var stateCopy = Object.assign({}, state);
			stateCopy.response = "שינוי סיסמא נכשל, אנא נסה/י שנית";
			return stateCopy;

		case Actions.SIGNUP_SUCCESS:
			return Object.assign({}, state, {
				status: 'registered'
			});

		case Actions.SIGNUP_ERROR:
			console.log(action);
			break;


		default:
			return state || {
				status: ''
			};
	}

};

module.exports = loginReducer;