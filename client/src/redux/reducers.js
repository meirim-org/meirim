import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modal/slice';
import userReducer from './user/slice';

const rootReducer = combineReducers({
	modal: modalReducer,
	user: userReducer
});

export default rootReducer;

