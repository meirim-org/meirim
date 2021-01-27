import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modal/slice';
import userReducer from './user/slice';
import commentsReducer from './comments/slice';
import planReducer from './plan/slice';
import fundingReducer from './funding/slice';
import treeReducer from './tree/slice';

const rootReducer = combineReducers({
	modal: modalReducer,
	user: userReducer,
	comments: commentsReducer,
	plan: planReducer,
	funding: fundingReducer,
	tree: treeReducer
});

export default rootReducer;

