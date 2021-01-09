import { createSlice } from '@reduxjs/toolkit';

const fundingSlice = createSlice({
	name: 'funding',
	initialState: {
		statsData: {
			totalAmount: 0,
			count: 0
		}
	},
	reducers: {
		setStatsData(state, type) {
			state.statsData = type.payload.statsData;
		}
	}
});

export const { setStatsData } = fundingSlice.actions;

export default fundingSlice.reducer;
