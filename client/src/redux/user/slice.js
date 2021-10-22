import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		isAuthenticated: false,
		user: {},
		favoritePlans: []
	},
	reducers: {
		 authenticated(state, type) {
			state.user = type.payload.user;
			state.isAuthenticated = true;
		},
		notAuthenticated(state) {
			state.isAuthenticated = false;
			state.user = {};
		},
		fetchedFavoritePlans(state, type) {
			state.favoritePlans = type.payload.favoritePlans;
		},
		subscribedToPlan(state, type) {
			state.favoritePlans.push(type.payload.planId);
		},
		unsubscribedFromPlan(state, type) {
			state.favoritePlans = state.favoritePlans.filter(pid => pid !== type.payload.planId)
		}
	}
});

export const { authenticated, notAuthenticated, fetchedFavoritePlans, subscribedToPlan, unsubscribedFromPlan } = userSlice.actions;

export default userSlice.reducer;