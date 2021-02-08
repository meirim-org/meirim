import { createSlice } from "@reduxjs/toolkit";

const treeSlice = createSlice({
    name: "tree",
    initialState: {
        treeData: {},
    },
    reducers: {
        setTreeData(state, type) {
            state.treeData = type.payload.treeData;
            state.responseCode = type.payload.responseCode;
        },
        resetTreeData(state) {
            state.treeData = [];
            state.responseCode = 0;
        },
    },
});

export const { setTreeData, resetTreeData } = treeSlice.actions;
export default treeSlice.reducer;
