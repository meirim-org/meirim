import { createSlice } from '@reduxjs/toolkit';

const planSlice = createSlice({
	name: 'plan',
	initialState: {
		data: [],
		responseCode: 0
	},
	reducers: {
		setData(state, type) {
			state.data = type.payload.data;
			state.responseCode = type.payload.responseCode;
		},
	}
});

export const { setData } = planSlice.actions;

export default planSlice.reducer;