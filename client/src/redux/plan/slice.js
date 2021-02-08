import { createSlice } from "@reduxjs/toolkit";

const planSlice = createSlice({
    name: "plan",
    initialState: {
        dataArea: [],
        dataUnits: [],
        planData: {},
        textArea: {},
        responseCode: 0,
    },
    reducers: {
        setPlanData(state, type) {
            state.planData = type.payload.planData;
            state.textArea = type.payload.textArea;
            state.dataArea = type.payload.dataArea;
            state.dataUnits = type.payload.dataUnits;
            state.responseCode = type.payload.responseCode;
        },
        resetPlanData(state) {
            state.planData = [];
            state.textArea = {};
            state.dataArea = [];
            state.dataUnits = [];
            state.responseCode = 0;
        },
    },
});

export const { setPlanData, resetPlanData } = planSlice.actions;

export default planSlice.reducer;
