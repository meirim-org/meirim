import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
	name: 'comments',
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

export const { setData } = commentsSlice.actions;

export default commentsSlice.reducer;