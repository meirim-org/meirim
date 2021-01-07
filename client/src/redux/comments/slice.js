import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
	name: 'comments',
	initialState: {
		data: [],
		responseCode: 0,
		commentsCount: ''
	},
	reducers: {
		setData(state, type) {
			state.data = type.payload.data;
			state.responseCode = type.payload.responseCode;
			state.commentsCount = type.payload.commentsCount;
		},
	}
});

export const { setData } = commentsSlice.actions;

export default commentsSlice.reducer;