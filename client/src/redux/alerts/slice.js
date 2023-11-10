import { createSlice } from '@reduxjs/toolkit';

const alertsSlice = createSlice({
	name: 'alerts',
	initialState: {
		list: [],
	},
	reducers: {
		setAlerts(state, type) {
			state.list = type.payload.list;
		},
	},
});

export const { setAlerts } = alertsSlice.actions;

export default alertsSlice.reducer;
