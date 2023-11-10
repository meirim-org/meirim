import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		isAuthenticated: false,
		isAdmin: false,
		user: {},
		favoritePlans: [],
	},
	reducers: {
		authenticated(state, type) {
			state.user = type.payload.user;
			state.isAuthenticated = true;
			state.isAdmin =
				type.payload.user.admin && type.payload.user.admin !== '0';
		},
		notAuthenticated(state) {
			state.isAuthenticated = false;
			state.isAdmin = false;
			state.user = {};
		},
		fetchedFavoritePlans(state, type) {
			state.favoritePlans = type.payload.favoritePlans;
		},
		subscribedToPlan(state, type) {
			state.favoritePlans.push(type.payload.planId);
		},
		unsubscribedFromPlan(state, type) {
			state.favoritePlans = state.favoritePlans.filter(
				(pid) => pid !== type.payload.planId
			);
		},
	},
});

export const {
	authenticated,
	notAuthenticated,
	fetchedFavoritePlans,
	subscribedToPlan,
	unsubscribedFromPlan,
} = userSlice.actions;

export default userSlice.reducer;
