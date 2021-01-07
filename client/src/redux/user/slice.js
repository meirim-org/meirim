import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		isAuthenticated: false,
		user: {}
	},
	reducers: {
		 authenticated(state, type) {
			state.user = type.payload.user;
			state.isAuthenticated = true;
		},
		notAuthenticated(state) {
			state.isAuthenticated = false;
			state.user = {};
		}
	}
});

export const { authenticated, notAuthenticated } = userSlice.actions;

export default userSlice.reducer;